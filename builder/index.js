const { readFileSync, writeFileSync } = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const util = require("yaml-util");

const rootDirectory = path.resolve(__dirname, "..");
const contentPath = path.resolve(rootDirectory, "content/index.yml");
const pagePath = path.resolve(rootDirectory, "site/index.yml");


const content = util.importFile()(contentPath)

console.log(content);