// Cloudflareの検証を回避するための初期化
globalThis.__dirname = "/";
globalThis.__filename = "/index.js";

export default {
  async fetch(request, env, ctx) {
    try {
      const { uvPath } = await import("@titaniumnetwork-dev/ultraviolet");
      const express = (await import("express")).default;
      const { join } = await import("node:path");
      const { readFileSync } = await import("node:fs");

      const app = express();
      
      // 静的ファイル配信
      app.use(express.static(uvPath));
      app.use(express.static(join(process.cwd(), "public")));

      // ルーティングを通さず、リクエストが来たらHTMLを直接返す
      return new Response(readFileSync(join(process.cwd(), "public/index.html"), "utf8"), {
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });

    } catch (err) {
      return new Response(`[Worker Runtime Error]\nMessage: ${err.message}\nStack: ${err.stack}`, { 
        status: 500,
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }
  }
};
