const http = require("http");
const fs = require("fs");
const url = require("url");
const querystring = require("querystring");
const template = require("./lib/template");
const path = require("path");

const app = http.createServer((request, response) => {
  const requestUrl = request.url;
  const queryData = url.parse(requestUrl, true).query;
  const pathname = url.parse(requestUrl, true).pathname;
  if (pathname === "/") {
    if (queryData.id === undefined) {
      fs.readdir("./data", (err, fileList) => {
        const title = "Welcome";
        const description = "Welcome node.js";
        const list = template.list(fileList);
        const html = template.html(
          title,
          list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
    } else {
      const title = queryData.id;
      fs.readdir("./data", (err, fileList) => {
        const filteredId = path.parse(title).base;
        fs.readFile(`data/${filteredId}`, "utf-8", (err, description) => {
          const list = template.list(fileList);
          const html = template.html(
            title,
            list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>
            <a href="/update?id=${title}">update</a>
            <form action="delete_process" method="post">
              <input type="hidden" name="id" value="${title}" />
              <input type="submit" value="delete" />
            </form>
            `
          );
          response.writeHead(200);
          response.end(html);
        });
      });
    }
  } else if (pathname === "/create") {
    fs.readdir("./data", (err, fileList) => {
      const title = "WEB - create";
      const list = template.list(fileList);
      const html = template.html(
        title,
        list,
        `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title" /></p>
            <p><textarea name="description" placeholder="description"></textarea></p>
            <p><input type="submit"></p>
          </form>
        `,
        ""
      );
      response.writeHead(200);
      response.end(html);
    });
  } else if (pathname === "/create_process") {
    let body = "";
    request.on("data", (data) => {
      body = body + data;
    });
    request.on("end", () => {
      const post = querystring.parse(body);
      const title = post.title;
      const description = post.description;
      const filteredId = path.parse(title).base;
      fs.writeFile(`data/${filteredId}`, description, "utf8", (err) => {
        response.writeHead(302, { Location: `/?id=${title}` });
        response.end();
      });
    });
  } else if (pathname === "/update") {
    const title = queryData.id;
    fs.readdir("./data", (err, fileList) => {
      const filteredId = path.parse(title).base;
      fs.readFile(`data/${filteredId}`, "utf-8", (err, description) => {
        const list = template.list(fileList);
        const html = template.html(
          title,
          list,
          `<form action="/update_process" method="post">
            <input type="hidden" name="id" value="${title}"
            <p><input type="text" name="title" placeholder="title" value=${title} /></p>
            <p><textarea name="description" placeholder="description" >${description}</textarea></p>
            <p><input type="submit"></p>
          </form>`,
          `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
    });
  } else if (pathname === "/update_process") {
    let body = "";
    request.on("data", (data) => {
      body = body + data;
    });
    request.on("end", () => {
      const post = querystring.parse(body);
      const id = post.id;
      const title = post.title;
      const description = post.description;
      const filteredId = path.parse(title).base;
      fs.rename(`data/${id}`, `data/${filteredId}`, (err) => {
        fs.writeFile(`data/${filteredId}`, description, "utf8", (err) => {
          response.writeHead(302, { Location: `/?id=${filteredId}` });
          response.end();
        });
      });
    });
  } else if (pathname === "/delete_process") {
    let body = "";
    request.on("data", (data) => {
      body = body + data;
    });
    request.on("end", () => {
      const post = querystring.parse(body);
      const id = post.id;
      const filteredId = path.parse(id).base;
      fs.unlink(`data/${filteredId}`, (err) => {
        response.writeHead(302, { Location: "/" });
        response.end();
      });
    });
  } else {
    response.writeHead(404);
    response.end("Not found");
  }
});
app.listen(3000);
