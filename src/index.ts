import OpenAPIHelper from './OpenAPIHelper';

const openAPIPath = 'backend/openapi_schema.json';
const postmanOutputPath = 'openapi/openapi_schema_collection.json';
const outputAPIPath = 'openapi/openapi_schema_with_samples.json';

OpenAPIHelper.convertOpenAPIToPostman(openAPIPath, postmanOutputPath);
OpenAPIHelper.generateSampleCode(postmanOutputPath);
OpenAPIHelper.addSampleCodeToOpenAPI(openAPIPath, outputAPIPath);

console.log('Process completed successfully.');
