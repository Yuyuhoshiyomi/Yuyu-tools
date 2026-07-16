// Cloudflareの検証を回避するための初期化
globalThis.__dirname = "/";
globalThis.__filename = "/index.js";

export default {
  async fetch(request, env, ctx) {
    try {
      // 必要なライブラリを動的に読み込む
      const { uvPath } = await import("@titaniumnetwork-dev/ultraviolet");
      const express = (await import("express")).default;
      const { join } = await import("node:path");
      
      const app = express();
      
      // 1. 静的ファイル（Ultravioletのクライアントスクリプトなど）を配信
      app.use(express.static(uvPath));
      
      // 2. 自分のサイトのファイル（publicフォルダ）を配信
      app.use(express.static(join(process.cwd(), "public")));
      
      // 3. ルーティング記法を使わず、全てのリクエストを直接index.htmlに返す
      app.use((req, res) => {
        res.sendFile(join(process.cwd(), "public/index.html"));
      });
      
      return await app(request);
    } catch (err) {
      // エラーが起きた場合は原因を画面に表示
      return new Response(`[Worker Runtime Error]\nMessage: ${err.message}\nStack: ${err.stack}`, { 
        status: 500,
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }
  }
};
