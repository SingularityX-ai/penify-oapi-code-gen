#!/usr/bin/env node

const OpenAPIHelper = require('./OpenAPIHelper');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// Parse command-line arguments
const argv = yargs(hideBin(process.argv))
  .usage('Usage: penify-oapi-codegen -i <input> -l <language> -v <variant> -o <output> \n penify-oapi-codegen -s')
  .option('i', {
    alias: 'input',
    describe: 'Path to the OpenAPI JSON or YAML file',
    type: 'string'
  })
  .option('l', {
    alias: 'language',
    describe: 'Language input (optional)',
    type: 'string'
  })
  .option('v', {
    alias: 'variant',
    describe: 'Variant input (optional)',
    type: 'string'
  })
  .option('o', {
    alias: 'output',
    describe: 'Output file path (optional)',
    type: 'string'
  })
  .option('s', {
    alias: 'supported-languages',
    describe: 'Get the list of supported languages',
    type: 'boolean'
  })
  .help()
  .argv;

const openAPIPath = argv.i;
const language = argv.l || null;
const variant = argv.v || null;
const showSupportedLanguages = argv.s || null;

if (showSupportedLanguages) {
  const supportedLanguages = OpenAPIHelper.getSupportedLanguagesAndVariants();
  console.log('| Language       | Variant        |');
  console.log('|----------------|----------------|');
  supportedLanguages.forEach(item => {
    console.log(`| ${item.language.padEnd(14)} | ${item.variant.padEnd(14)} |`);
  });
  process.exit(0);
}


const outputAPIPath = argv.o || path.resolve(`${path.basename(openAPIPath, path.extname(openAPIPath))}_with_code.json`);

if (!openAPIPath) {
  console.error('Please provide the path to the OpenAPI file.');
  process.exit(1);
}

const resolvedOpenAPIPath = path.resolve(openAPIPath);
const guid = uuidv4();

const postmanOutputPath = path.resolve(`/tmp/openapi_schema_postman_${guid}.json`);

console.log("Executing step 1.");
OpenAPIHelper.convertOpenAPIToPostman(resolvedOpenAPIPath, postmanOutputPath);
console.log("Executing step 2.");
OpenAPIHelper.generateSampleCode(postmanOutputPath, language, variant);
console.log("Executing step 3.");
OpenAPIHelper.addSampleCodeToOpenAPI(resolvedOpenAPIPath, outputAPIPath);

console.log('Process completed successfully.');
