import * as bareMux from "@mercuryworkshop/bare-mux";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import express from "express";
import { createServer } from "node:http";
import { join } from "node:path";
import { wispPath } from "wisp-server-node";
import * as epoxy from "@mercuryworkshop/epoxy-transport";

// 実行時のエラーを完全に防ぐためのグローバル定義
if (typeof globalThis.__dirname === "undefined") {
  globalThis.__dirname = "/";
}
if (typeof globalThis.__filename === "undefined") {
  globalThis.__filename = "/index.js";
}

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

// Cloudflare Workers用のインターフェース
export default {
  async fetch(request, env, ctx) {
    try {
      // 内部エラーが発生してもWorker自体がクラッシュしないようにキャッチする
      return await app(request);
    } catch (err) {
      return new Response(`Worker Internal Error: ${err.message}\n${err.stack}`, {
        status: 500,
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }
  }
};
