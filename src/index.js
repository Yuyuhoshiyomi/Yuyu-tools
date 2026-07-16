// エラーの原因になる __dirname と __filename を事前にダミー定義して回避
globalThis.__dirname = "/";
globalThis.__filename = "/index.js";

import * as bareMux from "@mercuryworkshop/bare-mux";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import express from "express";
import { createServer } from "node:http";
import { join } from "node:path";
import { wispPath } from "wisp-server-node";
import * as epoxy from "@mercuryworkshop/epoxy-transport";

// ライブラリの安全な読み込み
const createBareServer = bareMux.createBareServer || bareMux.default?.createBareServer;
const epoxyPath = epoxy.epoxyPath || epoxy.default?.epoxyPath || "";

const app = express();
const server = createServer();
const bare = createBareServer ? createBareServer("/bare/") : null;

app.use(express.static(uvPath));
if (epoxyPath) app.use(express.static(epoxyPath));
app.use(express.static(wispPath));
app.use(express.static(join(process.cwd(), "public")));

app.use((req, res, next) => {
  if (bare && bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else {
    next();
  }
});

app.get("/*", (req, res) => {
  res.sendFile(join(process.cwd(), "public/index.html"));
});

// Cloudflare Workers用
export default {
  async fetch(request, env, ctx) {
    return app(request);
  }
};
