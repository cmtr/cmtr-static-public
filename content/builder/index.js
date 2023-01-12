const buildContext = require("./build");

const rootDirectory = __dirname + "/../"
const contentPath = rootDirectory + "content/index.yml"
const contextPath = rootDirectory + "./output/context.yml";

buildContext(contentPath, contextPath, { rootDirectory: rootDirectory + "./content/"});

const renderConfigPath = rootDirectory + "./page.yml"
const renderConfigOutputPath = rootDirectory + "./output/page.yml";

const renderConfig = buildContext(renderConfigPath, renderConfigOutputPath, { rootDirectory })

console.log(renderConfig);