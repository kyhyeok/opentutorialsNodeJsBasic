const http = require("http");
const fs = require("fs");
const url = require("url");
const querystring = require("querystring");

const templateHTML = (title, list, body) => `
  <!doctype html>
  <html>
    <head>
      <title>WEB2 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB2</a></h1>
        ${list}
        <a href="/create">create</a>
        ${body}
    </body>
  </html>
  `;

const templateList = (fileList) => {
  let i = 0;
  let list = "<ul>";
  while (i < fileList.length) {
    list = list + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
    i++;
  }
  list = list + "</ul>";
  return list;
};

const app = http.createServer((request, response) => {
  const requestUrl = request.url;
  const queryData = url.parse(requestUrl, true).query;
  const pathname = url.parse(requestUrl, true).pathname;
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
  } else if (pathname === "/create") {
    fs.readdir("./data", (err, fileList) => {
      const title = "WEB - create";
      const list = templateList(fileList);
      const template = templateHTML(
        title,
        list,
        `
          <form action="http://localhost:3000/create_process" method="post">
            <p><input type="text" name="title" placeholder="title" /></p>
            <p><textarea name="description" placeholder="description"></textarea></p>
            <p><input type="submit"></p>
          </form>
        `
      );
      response.writeHead(200);
      response.end(template);
    });
  } else if (pathname === "/create_process") {
    let body = "";
    request.on("data", (data) => {
      body = body + data;
    });
    request.on("end", () => {});
    response.writeHead(200);
    response.end("success");
  } else {
    response.writeHead(404);
    response.end("Not found");
  }
});
app.listen(3000);
