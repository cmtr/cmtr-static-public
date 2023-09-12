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
const ejs = require("ejs");
const pretty = require("pretty");
const marked = require("marked");

module.exports = (page) =>  {
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
			writeFileSync(outputPath, pretty(html, { ocd: true }), { encoding: "utf8"});
		});

		console.log(`Page ${page.id} successfully rendered`);
	} catch (error) {
		console.error(`Page "${page.id}" failed to render`);
		console.trace(error);
	}
};