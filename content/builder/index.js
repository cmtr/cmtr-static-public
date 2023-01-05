const { readFileSync, writeFileSync } = require("fs");
const _ = require("lodash");
const yaml = require("js-yaml");
const YamlUtil = require("yaml-util");

const rootDirectory = __dirname + "/../content/"
const path = rootDirectory + "./index.yml";
const payload = yaml.load(readFileSync(path, { encoding: "utf-8" }));
console.log("Original:\n");
console.log(payload);

console.log(`\nTransformed:\n`);
const transform = _.flow(
	YamlUtil.yamlFile(rootDirectory),
	YamlUtil.jsonFile(rootDirectory),
	YamlUtil.file(rootDirectory),
	YamlUtil.ref
);

const transformed = transform(payload);
console.log(transformed);

const outputYaml = yaml.dump(transformed);

writeFileSync("output.yml", outputYaml, { encoding: "utf-8"});