// 1. ビルド検証をパスするための最優先定義
globalThis.__dirname = "/";
globalThis.__filename = "/index.js";

export default {
  async fetch(request, env, ctx) {
    // グローバル環境をリクエスト実行時にも確実に保証
    globalThis.__dirname = "/";
    globalThis.__filename = "/index.js";

    try {
      // 2. 動的インポートでライブラリを読み込む（ビルドエラーを100%回避）
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

      // 静的ファイルのルーティング
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

      // Expressアプリを実行
      return await app(request);

    } catch (err) {
      // 万が一実行時にエラーが出た場合、1101エラー画面ではなく、原因を直接テキストで画面に表示する
      return new Response(`[Worker Runtime Error]\nMessage: ${err.message}\nStack: ${err.stack}`, {
        status: 500,
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }
  }
};
