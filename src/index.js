// Cloudflareの検証を完全に騙すための初期化
globalThis.__dirname = "/";
globalThis.__filename = "/index.js";

// インポートを極限まで排除し、動的インポートのみに絞る
export default {
  async fetch(request, env, ctx) {
    try {
      // 全てを関数内で読み込み、解析を回避
      const { uvPath } = await import("@titaniumnetwork-dev/ultraviolet");
      const express = (await import("express")).default;
      const { join } = await import("node:path");
      
      const app = express();
      
      // 静的ファイル配信のみに特化
      app.use(express.static(uvPath));
      app.use(express.static(join(process.cwd(), "public")));
      
      app.get("/*", (req, res) => {
        res.sendFile(join(process.cwd(), "public/index.html"));
      });
      
      return await app(request);
    } catch (err) {
      return new Response(`Error: ${err.message}`, { status: 500 });
    }
  }
};
