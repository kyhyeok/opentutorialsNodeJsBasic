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
        <style>
            table {
                border-collapse: collapse;
            }
            td {
                border: 1px solid black;
            }
        </style>
      `,
        `<a href="/create">create</a>`
      );
      response.writeHead(200);
      response.end(html);
    });
  });
};
