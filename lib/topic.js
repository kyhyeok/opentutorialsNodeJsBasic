const url = require("url");
const querystring = require("querystring");
const db = require("./db");
const template = require("./template");

exports.home = (request, response) => {
  db.query(`select * from topics`, (error, topics, fields) => {
    const title = "Welcome";
    const description = "Welcome node.js";
    const list = template.list(topics);
    const html = template.html(
      title,
      list,
      `<h2>${title}</h2>${description}`,
      `<a href="/create">create</a>`
    );
    response.writeHead(200);
    response.end(html);
  });
};

exports.page = (request, response) => {
  const requestUrl = request.url;
  const queryData = url.parse(requestUrl, true).query;
  db.query(`select * from topics`, (error, results, fields) => {
    if (error) {
      throw error;
    }
    db.query(
      `select * from topics LEFT JOIN author ON topics.author_id = author.id WHERE topics.id=?`,
      [queryData.id],
      (errorWhere, result, fields) => {
        if (errorWhere) {
          throw errorWhere;
        }
        const title = result[0].title;
        const description = result[0].description;
        const list = template.list(results);
        const html = template.html(
          title,
          list,
          `<h2>${title}</h2><p>${description}</p>by ${result[0].name}`,
          `<a href="/create">create</a>
               <a href="/update?id=${queryData.id}">update</a>
               <form action="delete_process" method="post">
               <input type="hidden" name="id" value="${queryData.id}" />
               <input type="submit" value="delete" />
             </form>
             `
        );
        response.writeHead(200);
        response.end(html);
      }
    );
  });
};

exports.create = (request, response) => {
  db.query(`select * from topics`, (error, topics, fields) => {
    db.query(`select * from author`, (error2, authors, fields) => {
      const title = "create";
      const list = template.list(topics);
      const html = template.html(
        title,
        list,
        `<form action="/create_process" method="post">
              <p><input type="text" name="title" placeholder="title" /></p>
              <p><textarea name="description" placeholder="description"></textarea></p>
              <p>
                ${template.authorSelect(authors)}
              </p>
              <input type="submit">
            </form>`,
        `<a href="/create">create</a>`
      );
      response.writeHead(200);
      response.end(html);
    });
  });
};

exports.create_process = (request, response) => {
  let body = "";
  request.on("data", (data) => {
    body = body + data;
  });
  request.on("end", () => {
    const post = querystring.parse(body);
    const title = post.title;
    const description = post.description;
    db.query(
      `
      INSERT INTO topics (title, description, created, author_id)
      VALUES(?, ?, NOW(), ?)`,
      [title, description, post.author],
      (error, result) => {
        if (error) {
          throw error;
        }
        response.writeHead(302, { Location: `/?id=${result.insertId}` });
        response.end();
      }
    );
  });
};

exports.update = (request, response) => {
  const requestUrl = request.url;
  const queryData = url.parse(requestUrl, true).query;
  db.query(`select * from topics`, (error, topics, fields) => {
    if (error) {
      throw error;
    }
    db.query(
      `select * from topics WHERE id=?`,
      [queryData.id],
      (errorWhere, topic, fields) => {
        if (errorWhere) {
          throw errorWhere;
        }
        db.query(`select * from author`, (error2, authors, fields) => {
          const list = template.list(topics);
          const html = template.html(
            topic[0].title,
            list,
            `<form action="/update_process" method="post">
              <input type="hidden" name="id" value="${topic[0].id}"
              <p><input type="text" name="title" placeholder="title" value=${
                topic[0].title
              } /></p>
              <p><textarea name="description" placeholder="description" >${
                topic[0].description
              }</textarea></p>
              <p>
              ${template.authorSelect(authors, topic[0].author_id)}
              </p>
              <p><input type="submit"></p>
            </form>`,
            `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
          );
          response.writeHead(200);
          response.end(html);
        });
      }
    );
  });
};

exports.update_process = (request, response) => {
  let body = "";
  request.on("data", (data) => {
    body = body + data;
  });
  request.on("end", () => {
    const post = querystring.parse(body);
    const id = post.id;
    const title = post.title;
    const author_id = post.author;
    const description = post.description;
    db.query(
      `UPDATE topics SET title=?, description=?, author_id=? WHERE id=?`,
      [title, description, author_id, id],
      (error, result) => {
        if (error) {
          throw error;
        }
        response.writeHead(302, { Location: `/?id=${id}` });
        response.end();
      }
    );
  });
};

exports.delete_process = (request, response) => {
  let body = "";
  request.on("data", (data) => {
    body = body + data;
  });
  request.on("end", () => {
    const post = querystring.parse(body);
    const id = post.id;
    db.query(`DELETE FROM topics WHERE id = ?`, [id], (error, reuslt) => {
      if (error) {
        throw error;
      }
      response.writeHead(302, { Location: "/" });
      response.end();
    });
  });
};
