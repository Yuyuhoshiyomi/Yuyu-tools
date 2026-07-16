// 1. 最優先でグローバル変数を定義（インポート前に確実に実行されるようにします）
globalThis.__dirname = "/";
globalThis.__filename = "/index.js";

// 2. モジュールを動的にインポートして動作させる
export default {
  async fetch(request, env, ctx) {
    const bareMux = await import("@mercuryworkshop/bare-mux");
    const { uvPath } = await import("@titaniumnetwork-dev/ultraviolet");
    const express = (await import("express")).default;
    const { join } = await import("node:path");
    const { wispPath } = await import("wisp-server-node");
    const epoxy = await import("@mercuryworkshop/epoxy-transport");

    const createBareServer = bareMux.createBareServer || bareMux.default?.createBareServer;
    const epoxyPath = epoxy.epoxyPath || epoxy.default?.epoxyPath || "";

    const app = express();
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

    return app(request);
  }
};
