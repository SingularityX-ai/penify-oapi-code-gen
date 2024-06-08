#!/usr/bin/env node

const OpenAPIHelper = require('./OpenAPIHelper');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Get the OpenAPI JSON path from the command-line arguments
const openAPIPath = process.argv[2];
const language = process.argv[3] || null; // Language input (optional)
const variant = process.argv[4] || null;  // Variant input (optional)

if (!openAPIPath) {
  console.error('Please provide the path to the OpenAPI JSON file.');
  process.exit(1);
}

const resolvedOpenAPIPath = path.resolve(openAPIPath);
const file_name = path.basename(resolvedOpenAPIPath);
const guid = uuidv4();

const postmanOutputPath = path.resolve(`/tmp/openapi_schema_postman_${guid}.json`);
const outputAPIPath = path.resolve(`${file_name}_with_code.json`);
console.log("Executing step 1.");
OpenAPIHelper.convertOpenAPIToPostman(resolvedOpenAPIPath, postmanOutputPath);
console.log("Executing step 2.");
OpenAPIHelper.generateSampleCode(postmanOutputPath);
console.log("Executing step 3.");
OpenAPIHelper.addSampleCodeToOpenAPI(resolvedOpenAPIPath, outputAPIPath);

console.log('Process completed successfully.');
