import { createBareServer } from "@mercuryworkshop/bare-mux";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import express from "express";
import { createServer } from "node:http";
import { join } from "node:path";
import { wispPath } from "wisp-server-node";

// epoxy-transportの読み込みを修正
import * as epoxy from "@mercuryworkshop/epoxy-transport";
const epoxyPath = epoxy.epoxyPath || epoxy.default || "";

const app = express();
const server = createServer();
const bare = createBareServer("/bare/");

app.use(express.static(uvPath));
if (epoxyPath) app.use(express.static(epoxyPath));
app.use(express.static(wispPath));
app.use(express.static(join(process.cwd(), "public")));

app.use((req, res, next) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else {
    next();
  }
});

app.get("/*", (req, res) => {
  res.sendFile(join(process.cwd(), "public/index.html"));
});

// Cloudflare Workers (ES Module形式) への適応
export default {
  async fetch(request, env, ctx) {
    return app(request);
  }
};
