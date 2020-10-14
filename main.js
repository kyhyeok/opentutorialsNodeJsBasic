const http = require("http");
const fs = require("fs");
const url = require("url");
const app = http.createServer(function (request, response) {
  const requestUrl = request.url;
  const queryData = url.parse(requestUrl, true).query;
  const pathname = url.parse(requestUrl, true).pathname;
  let i = 0;

  const templateHTML = (title, list, body) => `
  <!doctype html>
  <html>
    <head>
      <title>WEB2 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
        ${list}
        ${body}
    </body>
  </html>
  `;

  const templateList = (fileList) => {
    let list = "<ul>";
    while (i < fileList.length) {
      list = list + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
      i++;
    }
    list = list + "<ul>";
    return list;
  };

  if (pathname === "/") {
    if (queryData.id === undefined) {
      fs.readdir("./data", (err, fileList) => {
        const title = "Welcome";
        const description = "Welcome node.js";
        const list = templateList(fileList);
        const template = templateHTML(
          title,
          list,
          `<h2>${title}</h2>${description}`
        );
        response.writeHead(200);
        response.end(template);
      });
    } else {
      const title = queryData.id;
      fs.readdir("./data", (err, fileList) => {
        fs.readFile(`data/${title}`, "utf-8", (err, description) => {
          const list = templateList(fileList);
          const template = templateHTML(
            title,
            list,
            `<h2>${title}</h2>${description}`
          );
          response.writeHead(200);
          response.end(template);
        });
      });
    }
  } else {
    response.writeHead(404);
    response.end("Not found");
  }
});
app.listen(3000);
