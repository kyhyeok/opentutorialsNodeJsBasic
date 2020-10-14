const http = require("http");
const fs = require("fs");
const url = require("url");
const app = http.createServer(function (request, response) {
  const requestUrl = request.url;
  const queryData = url.parse(requestUrl, true).query;
  console.log(queryData.id);
  if (requestUrl == "/") {
    requestUrl = "/index.html";
  }
  if (requestUrl == "/favicon.ico") {
    return response.writeHead(404);
  }
  response.writeHead(200);
  response.end(queryData.id);
});
app.listen(3000);
