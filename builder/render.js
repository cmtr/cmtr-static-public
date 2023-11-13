const { writeFileSync, existsSync, mkdirSync, rmSync } = require("fs");
const { resolve, dirname } = require("path");
const { promisify } = require('util');
const yaml = require("js-yaml");
const ejs = require("ejs");
const ejsRender = promisify(ejs.renderFile);
const marked = require("marked");
const pretty = require("pretty");

const ROOT_DIR = resolve(__dirname, "..");

/**
 * Render Function
 * 
 * @param template
 * @param context
 * @returns {Promise}
 * @throws {Error}
 * */
const renderFunction = (template, context) => {
	switch (template.type.toUpperCase()) {
		case "EJS":
			return ejsRender(resolve(ROOT_DIR, template.path), context)
				.then(html => pretty(html, { ocd: true }));
		default:
			throw new Error(`Template Type ${template.type} not supported`);
	}
}

/**
 * Write to File
 * @param path
 * @param data
 * @param options
 * @returns {string}
 * @throws {Error}
 * 
 * */
const writeToFile = (path, data, options={ encoding: "utf8" }) => {
	// Define output path
	const outputPath = resolve(ROOT_DIR, path);
	
	// Ensure directory Exists
	const outputDirectory = dirname(outputPath);
	if (!existsSync(outputDirectory)) mkdirSync(outputDirectory);

	writeFileSync(outputPath, data, options);
	return data;
}

/**
 * Persistance
 * @param output
 * @param data
 * @returns {Function}
 * @throws {Error}
 */
const handleOutput = (output) => (data) => {
	switch (output.type.toUpperCase()) {
		case "FILE":
			writeToFile(output.path, data, output.options);
			return {
				data,
				output
			}
		default:
			throw new Error(`Output Type ${output.type} not supported`);
	}
}

/**
 * Render
 * @param item
 * @returns {Promise}
 * @throws {Error}
 * */
const render = (item, globalContext={}) =>  {
	
	// Build Context
	const context = { ...globalContext, ...item.context };

	// Render
	return renderFunction(item.template, context)
		.then(handleOutput(item.output))
		.then(() => {
			console.log(`Item ${item.id} successfully rendered`);
		})
		.catch((error) => {
			console.error(`Item "${item.id}" failed to render`);
			console.log(error);	
		})

}

module.exports = render