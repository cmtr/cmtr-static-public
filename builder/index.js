const { readFileSync, writeFileSync } = require("fs");
const yaml = require("js-yaml");
const buildContext = require("./build");
const Render = require("./render");

const rootDirectory = __dirname + "/../"
const contentPath = rootDirectory + "content/index.yml"
const contextPath = rootDirectory + "./output/context.yml";