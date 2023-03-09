const { 
		readFileSync, 
		writeFileSync,
		existsSync,
		mkdirSync
	} = require("fs");
const { 
		resolve,
		dirname
	} = require("path");
const yaml = require("js-yaml");
const ejs = require("ejs");
const marked = require("marked");
const util = require("yaml-util");

const rootDirectory = resolve(__dirname, "..");
const contentPath = resolve(rootDirectory, "content/index.yml");
const sitePath = resolve(rootDirectory, "site/index.yml");

// Build content
const content = util.ref(util.importFile()(contentPath));
const contentOutputPath = resolve(rootDirectory, "output/content.yml");
writeFileSync(contentOutputPath, yaml.dump(content), { encoding: "utf8"});

// Build page
const site = util.ref(util.importFile()(sitePath));
const siteOutputPath = resolve(rootDirectory, "output/site.yml");

// Render

site.render.forEach((page) => {
	try {
		const templatePath = resolve(rootDirectory, page.template.path);
		writeFileSync(resolve(rootDirectory, "output/pageContext.yml"), yaml.dump(page.context), { encoding: "utf8"});
		
		const data = {
			 ...content, // Global Context
			 ...page.context, // Page Specific Context
			 // Utility functions 
			 // Note: It should not be possible to override utility function
			 marked: marked.parse 
		};

		ejs.renderFile(templatePath, data, (err, html) => {
			if (err) throw err;

			const outputPath = resolve(rootDirectory, page.output.path);
			
			// Ensure directory Exists
			const outputDirectory = dirname(outputPath);
			if (!existsSync(outputDirectory)) mkdirSync(outputDirectory);
			writeFileSync(outputPath, html, { encoding: "utf8"});
		});

		console.log(`Page ${page.id} successfully rendered`);
	} catch (error) {
		console.log(`Page "${page.id}" failed to render`);
		console.trace(error);
	}
});