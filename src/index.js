export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. プロキシリクエスト (/service/...) の場合
    if (url.pathname.startsWith('/service/')) {
      // 本来のUltravioletのプロキシ処理をここに記述します。
      // 現状は動作確認のためメッセージを返しています。
      return new Response("Ultraviolet プロキシ処理が起動しました。パス: " + url.pathname, {
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }

    // 2. メイン画面の表示 (index.html)
    const htmlContent = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>Utopia Proxy</title>
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
            const input = document.getElementById('url').value;
            // 入力されたURLをエンコードして /service/ へ転送
            location.href = '/service/' + btoa(input);
        }
    </script>
</body>
</html>
    `;

    return new Response(htmlContent, {
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  }
};
