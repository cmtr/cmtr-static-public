const { resolve } = require("path");
const yaml = require("js-yaml");
const util = require("yaml-util");
const marked = require("marked");
const render = require("./render");

const ROOT_DIR = resolve(__dirname, "..");

const sitePath = "site/index.yml"

// Read Site
const site = util.ref(util.importFile()(resolve(ROOT_DIR, sitePath)));

// Render
site.render.forEach(item => render(item, { ...site.context, marked: marked.parse }));