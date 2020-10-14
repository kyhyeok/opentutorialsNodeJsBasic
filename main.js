const http = require("http");
const fs = require("fs");
const url = require("url");
const app = http.createServer(function (request, response) {
  const requestUrl = request.url;
  const queryData = url.parse(requestUrl, true).query;
  const pathname = url.parse(requestUrl, true).pathname;
  let i = 0;

  if (pathname === "/") {
    if (queryData.id === undefined) {
      fs.readdir("./data", (err, fileList) => {
        const title = "Welcome";
        const description = "Welcome node.js";
        let list = "<ul>";
        while (i < fileList.length) {
          list =
            list + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
          i++;
        }
        list = list + "<ul>";
        const template = `
        <!doctype html>
        <html>
          <head>
            <title>WEB2 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
              ${list}
            <h2>${title}</h2>
            <p>${description}</p>
          </body>
        </html>
        `;
        response.writeHead(200);
        response.end(template);
      });
    } else {
      const title = queryData.id;
      fs.readFile(`data/${title}`, "utf-8", (err, description) => {
        fs.readdir("./data", (err, fileList) => {
          let list = "<ul>";
          while (i < fileList.length) {
            list =
              list +
              `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
            i++;
          }
          list = list + "<ul>";
          const template = `
          <!doctype html>
          <html>
            <head>
              <title>WEB2 - ${title}</title>
              <meta charset="utf-8">
            </head>
            <body>
              <h1><a href="/">WEB</a></h1>
                ${list}
              <h2>${title}</h2>
              <p>${description}</p>
            </body>
          </html>
          `;
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
