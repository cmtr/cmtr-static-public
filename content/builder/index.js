const { readFileSync, writeFileSync } = require("fs");
const yaml = require("js-yaml");
const buildContext = require("./build");
const Render = require("./render");

const rootDirectory = __dirname + "/../"
const contentPath = rootDirectory + "content/index.yml"
const contextPath = rootDirectory + "./output/context.yml";

buildContext(contentPath, contextPath, { rootDirectory: rootDirectory + "./content/"});

const renderConfigPath = rootDirectory + "./page.yml"
const renderConfigOutputPath = rootDirectory + "./output/page.yml";

const renderConfig = buildContext(renderConfigPath, renderConfigOutputPath, { rootDirectory })

const render = Render(rootDirectory);

const rendered = renderConfig.render.map(render);

writeFileSync(rootDirectory + "./output/rendered.json", JSON.stringify(rendered))