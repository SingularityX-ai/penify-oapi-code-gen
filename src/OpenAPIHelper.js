const fs = require('fs');
const { Collection } = require('postman-collection');
const codegen = require('postman-code-generators');
const { execSync } = require('child_process');
const { v4: uuidv4 } = require('uuid');

class OpenAPIHelper {
  static convertOpenAPIToPostman(openAPIPath, postmanOutputPath) {
    execSync(`openapi2postmanv2 -s ${openAPIPath} -o ${postmanOutputPath}`, { stdio: 'inherit' });
  }

  static generateSampleCode(postmanCollectionPath, language = 'python') {
    const collection = JSON.parse(fs.readFileSync(postmanCollectionPath).toString());
    const guid = uuidv4();
    if (!fs.existsSync(`sample_code_${guid}`)) {
      fs.mkdirSync('sample_code');
    }

    const supportedCodegens = codegen.getLanguageList();
    console.log(supportedCodegens);

    collection.item.forEach(item => {
      item.item.forEach(subItem => {
        const request = new Collection.Item(subItem).request;

        codegen.convert(language, 'http.client', request, {}, (error, snippet) => {
          if (error) {
            console.error(error);
          } else {
            fs.writeFileSync(`sample_code/${subItem.name}.py`, snippet);
          }
        });
      });
    });
  }

  static addSampleCodeToOpenAPI(openAPIPath, outputAPIPath) {
    const openapiSchema = JSON.parse(fs.readFileSync(openAPIPath).toString());
    const sampleCode = {};

    fs.readdirSync('sample_code').forEach(file => {
      const code = fs.readFileSync(`sample_code/${file}`).toString();
      const operationId = file.replace('.py', '');
      sampleCode[operationId] = code;
    });

    Object.keys(openapiSchema.paths).forEach(pathKey => {
      const path = openapiSchema.paths[pathKey];
      Object.keys(path).forEach(method => {
        if (path[method].operationId && sampleCode[path[method].operationId]) {
          path[method]['x-sample-code'] = sampleCode[path[method].operationId];
        }
      });
    });

    fs.writeFileSync(outputAPIPath, JSON.stringify(openapiSchema, null, 2));
  }
}

module.exports = OpenAPIHelper;
