module.exports = (req, res) => {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const redirectUri = "https://" + req.headers.host + "/api/callback";
  const scope = "repo,user";

  const authorizeUrl =
    "https://github.com/login/oauth/authorize" +
    "?client_id=" + encodeURIComponent(clientId) +
    "&redirect_uri=" + encodeURIComponent(redirectUri) +
    "&scope=" + encodeURIComponent(scope);

  res.writeHead(302, { Location: authorizeUrl });
  res.end();
};
