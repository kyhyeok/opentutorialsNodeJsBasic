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
            ${template.authorTable(authors)}
            <form action="author_create_process" method="post">
                <p>
                    <input type="text" name="name" placeholder="name" />
                </p>
                <p>
                    <textarea name="profile" placeholder="description about profile"></textarea>
                </p>
                <p>
                    <input type="submit" />
                </p>
            </form>
            <style>
                table {
                    border-collapse: collapse;
                }
                td {
                    border: 1px solid black;
                }
            </style>
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
