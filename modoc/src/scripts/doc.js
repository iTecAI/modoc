const tsj = require("ts-json-schema-generator");
const fs = require("fs");

/** @type {import('ts-json-schema-generator/dist/src/Config').Config} */
const configs = [
    
];

for (let config of configs) {
    console.log(`Generating schema for ${config.path} :: ${config.type}`);
    const schema = tsj.createGenerator(config).createSchema(config.type);
    const schemaString = JSON.stringify(schema, null, 2);
    fs.writeFile(config.output, schemaString, (err) => {
        if (err) throw err;
    });
    console.log(`Wrote schema to ${config.output}`);
}