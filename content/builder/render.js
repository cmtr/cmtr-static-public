const { readFileSync, writeFileSync } = require("fs");
const _ = require("lodash");
const yaml = require("js-yaml");

const rootDirectory = __dirname + "/../";
const path = rootDirectory + "./page.yml";
const payload = yaml.load(readFileSync(path, { encoding: "utf-8" }));
// console.log("Original:\n");
// console.log(payload);

payload.render.forEach(console.log);