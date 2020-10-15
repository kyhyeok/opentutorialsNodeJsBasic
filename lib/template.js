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
  list: (fileList) => {
    let i = 0;
    let list = "<ul>";
    while (i < fileList.length) {
      list = list + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
      i++;
    }
    list = list + "</ul>";
    return list;
  }
};
