export default {
  async fetch(request, env, ctx) {
    // ここに index.html の中身をコピーして貼り付けてください
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Utopia</title>
</head>
<body>
    <h1>Utopia 起動成功！</h1>
    <p>ファイル読み込みエラーを完全に回避しました。</p>
</body>
</html>
    `;

    return new Response(htmlContent, {
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  }
};
