const { readFileSync, writeFileSync } = require("fs");
const ejs = require("ejs");
const _ = require("lodash");
const yaml = require("js-yaml");

const DEFAULT_OPTIONS = {
	encoding: "utf-8"
}

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


module.exports = (rootDirectory, overrideOptions={}) => (obj) => {
	const userOptions = obj.template.options || {}
	const options = {
		...DEFAULT_OPTIONS,
		...overrideOptions,
		...userOptions
	}

	const templatePath = rootDirectory + obj.template.path;
	
	let output;
	let error;
	switch (obj.template.type) {
		case "EJS":
			ejs.renderFile(templatePath, obj.context, options, (err, str) => {
				output = str;
				error = err;
				console.log(err);
			});
			break;
		default:
			console.log("Throw some error here");
			console.log(obj);
	}

	return {
		...obj,
		render: {
			output, error
		}
	};
}
