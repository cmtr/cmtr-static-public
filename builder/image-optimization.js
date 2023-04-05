const sharp = require('sharp');
const fs = require('fs');
const filename = "test.jpg";
const outputDirectory = "./temp"



// Default Image Sizes and Nameing
const sizes = {
	thumbnail: 150,
	small: 480,
	medium: 720,
	large: 1080,
	extra: 2160
}

fs.readdirSync(directory)
	.forEach(file => {
		console.log(`Starting convertion of file ${directory}/${file}`)


		Object.entries(sizes)
			.forEach(([ sizeName, size ]) => {
				sharp(`${directory}/${file}`)
				    .resize({
				    	width: size,
				    	fit: "inside"
				    }) // width, height
				    .toFile(`${outputDirectory}/${sizeName}-${size}w-${file}`)
				    .then(() => {
				    	console.log(`Complete: ${sizeName}-${size}w-${file}`)
				    });
			});
	});