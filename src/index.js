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
      
      // 静的ファイル（Ultravioletのクライアントスクリプトなど）を配信
      app.use(express.static(uvPath));
      
      // 自分のサイトのファイル（publicフォルダ）を配信
      app.use(express.static(join(process.cwd(), "public")));
      
      // すべてのリクエストに対してフロントエンドのindex.htmlを返す
      // Express 5対応の安全なパス指定
      app.get("(.*)", (req, res) => {
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
