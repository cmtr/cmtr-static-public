const { readFileSync, writeFileSync } = require("fs");
const _ = require("lodash");
const yaml = require("js-yaml");
const YamlUtil = require("yaml-util");

const transform = (rootDirectory) => _.flow(
	YamlUtil.yamlFile(rootDirectory),
	YamlUtil.jsonFile(rootDirectory),
	YamlUtil.file(rootDirectory),
	YamlUtil.ref
);

const DEFAULT_OPTIONS = {
	format: "YAML",
	encoding: "utf-8"
};

module.exports = (inputPath, outputPath, opt={}) => {
	const options = {
		...DEFAULT_OPTIONS,
		...opt
	};

	const payload = yaml.load(readFileSync(inputPath, options));
	const transformed = transform(options.rootDirectory)(payload);
	

	switch (options.format) {
		case "YAML":
			output = yaml.dump(transformed);
			break;
		case "JSON":
			output = JSON.stringify(transformed)
			break;
		default:
			console.log(transformed)
	}

	if (outputPath)
		writeFileSync(outputPath, output, options);

	return transformed;
}