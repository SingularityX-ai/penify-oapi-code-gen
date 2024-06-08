#!/usr/bin/env node

const OpenAPIHelper = require('./OpenAPIHelper');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
console.log("suman1");

// Get the OpenAPI JSON path from the command-line arguments
const openAPIPath = process.argv[2];
const language = process.argv[3] || null; // Language input (optional)
const variant = process.argv[4] || null;  // Variant input (optional)

console.log("suman2");
if (!openAPIPath) {
  console.error('Please provide the path to the OpenAPI JSON file.');
  process.exit(1);
}
console.log("suman3");

const resolvedOpenAPIPath = path.resolve(openAPIPath);
const file_name = path.basename(resolvedOpenAPIPath);
const guid = uuidv4();
console.log("suman4");

const postmanOutputPath = path.resolve(`/tmp/openapi_schema_postman_${guid}.json`);
const outputAPIPath = path.resolve(`${file_name}_with_code.json`);
console.log("suman5");
OpenAPIHelper.convertOpenAPIToPostman(resolvedOpenAPIPath, postmanOutputPath);
OpenAPIHelper.generateSampleCode(postmanOutputPath);
OpenAPIHelper.addSampleCodeToOpenAPI(resolvedOpenAPIPath, outputAPIPath);

console.log('Process completed successfully.');
