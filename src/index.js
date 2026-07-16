export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/service/')) {
      try {
        const encodedUrl = url.pathname.replace('/service/', '');
        let targetUrl = atob(encodedUrl);
        
        // URLにプロトコルがない場合に追加
        if (!targetUrl.startsWith('http')) {
          targetUrl = 'https://' + targetUrl;
        }

        // 外部サイトへリクエスト
        const response = await fetch(targetUrl, {
            headers: request.headers,
            method: request.method,
            body: request.body,
            redirect: 'follow'
        });
        
        return response;
      } catch (e) {
        return new Response("プロキシエラー: " + e.message, { status: 500 });
      }
    }

    // メイン画面
    const htmlContent = `
<!DOCTYPE html>
<html>
<body>
    <h1>Utopia Proxy</h1>
    <input type="text" id="url" placeholder="https://google.com">
    <button onclick="go()">アクセス</button>
    <script>
        function go() {
            const input = document.getElementById('url').value;
            location.href = '/service/' + btoa(input);
        }
    </script>
</body>
</html>
    `;
    return new Response(htmlContent, { headers: { "Content-Type": "text/html" } });
  }
};
