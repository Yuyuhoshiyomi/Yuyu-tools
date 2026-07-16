import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import express from "express";
import { join } from "node:path";

const app = express();

// 1. 静的ファイル（Ultravioletのクライアントスクリプト等）を配信
app.use(express.static(uvPath));

// 2. UtopiaなどのHTML/JS/CSSが格納されているpublicフォルダを配信
app.use(express.static(join(process.cwd(), "public")));

// 3. すべてのリクエストに対してフロントエンドのindex.htmlを返す（SPAルーティング）
app.get("/*", (req, res) => {
  res.sendFile(join(process.cwd(), "public/index.html"));
});

export default {
  async fetch(request, env, ctx) {
    try {
      return await app(request);
    } catch (err) {
      return new Response(`[Worker Runtime Error]\nMessage: ${err.message}\nStack: ${err.stack}`, {
        status: 500,
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }
  }
};
