const { readFileSync, writeFileSync } = require("fs");
const ejs = require("ejs");
const _ = require("lodash");
const yaml = require("js-yaml");

const rootDirectory = __dirname + "/../";
const outputDirectory = rootDirectory + "./output"
const path = rootDirectory + "./test-page.yml";
const payload = yaml.load(readFileSync(path, { encoding: "utf-8" }));


const pageRenderConfig = payload.render[0];

const DEFAULT_OPTIONS = {
	encoding: "utf-8"
}

// Need to draw up the process as a UML Diagram 

const ejsPredicate = (obj) => obj.template.type && obj.template.type === "ejs"

const ejsRender = (rootDirectory, defaultOptions={}) => 
	(obj, overrideOptions={}) => {

		const userOptions = obj.template.options || {};
		const options = {
			...defaultOptions,
			...overrideOptions,
			...userOptions,
		};

		const templatePath = rootDirectory + obj.template.path;
		const templateString = readFileSync(templatePath, options);
		const template = ejs.compile(templateString, options);
		return template(obj.context);
	}

const ejsCase = {
	predicate: ejsPredicate,
	action: ejsRender
}

console.log(ejsRender(rootDirectory, DEFAULT_OPTIONS)(pageRenderConfig))