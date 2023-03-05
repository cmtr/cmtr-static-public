const { readFileSync, writeFileSync } = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const ejs = require("ejs");
const marked = require("marked");
const util = require("yaml-util");

const rootDirectory = path.resolve(__dirname, "..");
const contentPath = path.resolve(rootDirectory, "content/index.yml");
const sitePath = path.resolve(rootDirectory, "site/index.yml");

// Build content
const content = util.importFile()(contentPath)
const contentOutputPath = path.resolve(rootDirectory, "output/content.yml");
writeFileSync(contentOutputPath, yaml.dump(content), { encoding: "utf8"});

// Build page
const site = util.ref(util.importFile()(sitePath));
const siteOutputPath = path.resolve(rootDirectory, "output/site.yml");

// Render

site.render.forEach((page) => {
	try {
		const templatePath = path.resolve(rootDirectory, page.template.path);
		writeFileSync(path.resolve(rootDirectory, "output/pageContext.yml"), yaml.dump(page.context), { encoding: "utf8"});
		
		const data = {
			 ...content, // Global Context
			 ...page.context, // Page Specific Context
			 // Utility functions 
			 // Note: It should not be possible to override utility function
			 marked: marked.parse 
		};

		ejs.renderFile(templatePath, data, (err, html) => {
			if (err) throw err;
			const outputPath = path.resolve(rootDirectory, page.output.path);
			writeFileSync(outputPath, html, { encoding: "utf8"});
		});

		console.log("success");
	} catch (error) {
		console.log(`Page "${page.id}" failed to render`);
		console.trace(error);
	}
});