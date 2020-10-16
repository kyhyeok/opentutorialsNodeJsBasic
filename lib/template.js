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
        `<li><a href="/?id=${results[i].id}">${results[i].title}</a></li>`;
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
      tag += `<option value="${authors[i].id}" ${selected}>${authors[i].name}</option>`;
      i++;
    }

    return `<select name="author">
            ${tag}
          </select>`;
  }
};
