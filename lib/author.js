const url = require("url");
const querystring = require("querystring");
const db = require("./db");
const template = require("./template");

exports.home = (request, response) => {
  db.query(`select * from topics`, (error, topics, fields) => {
    db.query(`select * from author`, (error, authors, fields) => {
      const title = "author";
      const list = template.list(topics);
      const html = template.html(
        title,
        list,
        `
            <style>
                table {
                    border-collapse: collapse;
                }
                td {
                    border: 1px solid black;
                }
            </style>
            ${template.authorTable(authors)}
            <form action="author_create_process" method="post">
                <p>
                    <input type="text" name="name" placeholder="name" />
                </p>
                <p>
                    <textarea name="profile" placeholder="description about profile"></textarea>
                </p>
                <p>
                    <input type="submit" value="Create" />
                </p>
            </form>
            
      `,
        ``
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
    const name = post.name;
    const profile = post.profile;
    db.query(
      `
      INSERT INTO author (name, profile, created)
      VALUES(?, ?, NOW())`,
      [name, profile],
      (error, result) => {
        if (error) {
          throw error;
        }
        response.writeHead(302, { Location: `/author` });
        response.end();
      }
    );
  });
};

exports.update = (request, response) => {
  db.query(`select * from topics`, (error, topics, fields) => {
    db.query(`select * from author`, (error, authors, fields) => {
      const requestUrl = request.url;
      const queryData = url.parse(requestUrl, true).query;
      db.query(
        `select * from author where id=?`,
        [queryData.id],
        (error3, author, fields) => {
          const title = "author";
          const list = template.list(topics);
          const html = template.html(
            title,
            list,
            `
              <style>
                  table {
                      border-collapse: collapse;
                  }
                  td {
                      border: 1px solid black;
                  }
              </style>
              <form action="author/update_process" method="post">
                  <p>
                      <input type="hidden" name="id" value="${queryData.id}" />
                  </p>
                  <p>
                      <input type="text" name="name" placeholder="name"  value="${author[0].name}" />
                  </p>
                  <p>
                      <textarea name="profile" placeholder="description about profile">${author[0].profile}</textarea>
                  </p>
                  <p>
                      <input type="submit" value="Update" />
                  </p>
              </form>
              
        `,
            ``
          );
          response.writeHead(200);
          response.end(html);
        }
      );
    });
  });
};
