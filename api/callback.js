module.exports = async (req, res) => {
  const { code, error } = req.query;

  if (error || !code) {
    res.status(400).send("GitHub authorization failed or was cancelled.");
    return;
  }

  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  });
  const tokenData = await tokenRes.json();

  if (tokenData.error || !tokenData.access_token) {
    res.status(400).send("OAuth token exchange failed: " + (tokenData.error_description || tokenData.error || "unknown error"));
    return;
  }

  const payloadJson = JSON.stringify({ token: tokenData.access_token, provider: "github" });
  const fullMessage = "authorization:github:success:" + payloadJson;

  const html =
    "<!doctype html><html><body><script>" +
    "(function() {" +
    "function receiveMessage(e) {" +
    "window.opener.postMessage(" + JSON.stringify(fullMessage) + ", e.origin);" +
    'window.removeEventListener("message", receiveMessage, false);' +
    "}" +
    'window.addEventListener("message", receiveMessage, false);' +
    'window.opener.postMessage("authorizing:github", "*");' +
    "})();" +
    "</script></body></html>";

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
};
