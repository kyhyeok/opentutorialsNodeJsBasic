const sanitizeHTML = require("sanitize-html");

module.exports = {
  html: (title, list, body, control) => `
    <!doctype html>
    <html>
      <head>
        <title>WEB2 - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB2</a></h1>
        <a href="author">author</a>
          ${list}
          ${control}
          ${body}
      </body>
    </html>
    `,
  list: (results) => {
    let i = 0;
    let list = "<ul>";
    while (i < results.length) {
      list =
        list +
        `<li><a href="/?id=${results[i].id}">${sanitizeHTML(
          results[i].title
        )}</a></li>`;
      i++;
    }
    list = list + "</ul>";
    return list;
  },
  authorSelect: (authors, author_id) => {
    let tag = "";
    let i = 0;
    while (i < authors.length) {
      let selected = "";
      if (authors[i].id === author_id) {
        selected = " selected";
      }
      tag += `<option value="${authors[i].id}" ${selected}>${sanitizeHTML(
        authors[i].name
      )}</option>`;
      i++;
    }

    return `<select name="author">
            ${tag}
          </select>`;
  },
  authorTable: (authors) => {
    let tag = "<table>";
    let i = 0;
    while (i < authors.length) {
      tag += `
            <tr>
                <td>${sanitizeHTML(authors[i].name)}</td>
                <td>${sanitizeHTML(authors[i].profile)}</td>
                <td><a href="/author/update?id=${authors[i].id}">update</a></td>
                <td>
                  <form action="/author/delete_process" method="post">
                    <input type="hidden" name="id" value="${authors[i].id}" />
                    <input type="submit" value="Delete" />
                  </form>
                </td>
            </tr>
          `;
      i++;
    }
    tag += "</table>";
    return tag;
  }
};
