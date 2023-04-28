#!/usr/bin/env node

"use strict";

const path = require("path");
const chalk = require("chalk");
const VueEngine = require("./engines/vue");
const PugEngine = require("./engines/pug");
const JadeEngine = require("./engines/pug");
const walk = require("klaw-sync");

const args = process.argv;
const fileName = args[args.length - 1];
const filePath = path.join(process.cwd(), fileName);
let engine;

const ignoreFolders = [".nuxt", "node_modules"];
const files = walk(filePath, {
  nodir: true,
});

for (const file of files) {
  if (ignoreFolders.some(folder => file.path.includes(folder))) continue;
  if (file.path.includes(".vue")) engine = VueEngine(file.path);
  else if (file.path.includes(".pug")) engine = PugEngine(file.path);
  else if (file.path.includes(".jade")) engine = JadeEngine(file.path);
  else continue;

  if (engine.name === "vue" && !engine.hasSupportedVueTemplate()) {
    console.log(chalk.red("Not found supported template lang", file.path));
    continue;
  }
  const compiledResult = engine.convertTemplate();
  console.log(chalk.green("processed: ", file.path));
  engine.saveToFile(compiledResult);
}
