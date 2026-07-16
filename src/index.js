export default {
  async fetch(request, env, ctx) {
    const htmlContent = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>Utopia</title>
    <style>
        body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f0f0f0; }
        input { width: 80%; max-width: 500px; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px; }
        button { padding: 10px 20px; cursor: pointer; background: #007bff; color: white; border: none; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>Utopia Proxy</h1>
    <input type="text" id="url" placeholder="URLを入力してください (例: https://google.com)">
    <button onclick="go()">アクセス</button>

    <script>
        function go() {
            const url = document.getElementById('url').value;
            // 簡易的なプロキシ処理：Ultravioletのパスへリダイレクト
            location.href = '/service/' + btoa(url);
        }
    </script>
</body>
</html>
    `;

    // リクエストが /service/ で始まる場合はプロキシ処理へ転送（ここではデモとしてHTMLを返す）
    if (request.url.includes('/service/')) {
        return new Response("プロキシ機能が有効です。Ultravioletの設定を確認してください。", {
            headers: { "Content-Type": "text/html; charset=utf-8" }
        });
    }

    return new Response(htmlContent, {
        headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  }
};
