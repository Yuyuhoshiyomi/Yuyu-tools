export default {
  async fetch(request, env, ctx) {
    try {
      // 1. URLからパスを取得（/index.htmlなど）
      const url = new URL(request.url);
      let path = url.pathname === "/" ? "/index.html" : url.pathname;

      // 2. public フォルダ内のファイルを探索する（簡易実装）
      // ※実際はビルドツールがファイルを配置するので、
      // 動作しない場合は `import` ではなく、CloudflareのKVやAssets機能が本来の解決策ですが、
      // 現在の環境で最も動く可能性が高いのは「直接読み込み」です。
      
      const { readFileSync } = await import("node:fs");
      const { join } = await import("node:path");

      const filePath = join(process.cwd(), "public", path);
      const fileContent = readFileSync(filePath, "utf8");

      // 3. コンテンツタイプを判定して返す
      const contentType = path.endsWith(".html") ? "text/html" : 
                          path.endsWith(".js") ? "application/javascript" : "text/plain";

      return new Response(fileContent, {
        headers: { "Content-Type": `${contentType}; charset=utf-8` }
      });

    } catch (err) {
      return new Response(`[Static Loader Error]\nPath: ${new URL(request.url).pathname}\nMessage: ${err.message}`, { 
        status: 404 
      });
    }
  }
};
