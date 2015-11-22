minify: jsrand.js
	uglifyjs jsrand.js --comments --mangle --output jsrand.min.js --source-map jsrand.js.map
