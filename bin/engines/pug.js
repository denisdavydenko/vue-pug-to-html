"use strict";

const pug = require("pug");
const fs = require("fs");
const plugin = require("./plugin")(require("pug-walk"));

module.exports = function(filePath) {
  const contents = fs.readFileSync(filePath, "utf-8");

  return {
    name: "pug",

    convertTemplate() {
      console.log(filePath, contents);
      return pug.render(contents, {
        doctype: "html",
        pretty: true,
        plugins: [plugin],
      });
    },

    saveToFile(html) {
      fs.writeFileSync(filePath.replace(".pug", ".html"), html);
    },
  };
};
