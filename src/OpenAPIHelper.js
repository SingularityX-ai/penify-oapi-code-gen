const fs = require('fs');
const { Collection, Item } = require('postman-collection');
const codegen = require('postman-code-generators');
const { execSync } = require('child_process');

class OpenAPIHelper {
  static convertOpenAPIToPostman(openAPIPath, postmanOutputPath) {
    execSync(`openapi2postmanv2 -s ${openAPIPath} -o ${postmanOutputPath}`, { stdio: 'inherit' });
  }

  static generateSampleCode(postmanCollectionPath, language = null, variant = null) {
    console.log("postmanCollectionPath", postmanCollectionPath);
    const collection = JSON.parse(fs.readFileSync(postmanCollectionPath).toString());

    if (!fs.existsSync('sample_code')) {
      fs.mkdirSync('sample_code');
    }

    const generateForAll = (request) => {
      codegen.getLanguageList().forEach(lang => {
        lang.variants.forEach(vari => {
          codegen.convert(lang.key, vari.key, request, {}, (error, snippet) => {
            if (error) {
              console.error(error);
            } else {
              const fileName = `${lang.key}_${vari.key}_${request.name}.pm`;
              fs.writeFileSync(`sample_code/${fileName}`, snippet);
            }
          });
        });
      });
    };

    const generateForSpecific = (request) => {
      codegen.convert(language, variant, request, {}, (error, snippet) => {
        if (error) {
          console.error(error);
        } else {
          const fileName = `${language}_${variant}_${request.name}.pm`;
          fs.writeFileSync(`sample_code/${fileName}`, snippet);
        }
      });
    };

    collection.item.forEach(item => {
      item.item.forEach(subItem => {
        // const request = new Collection.Item(subItem).request;
        const request = new Item(subItem).request;
        if (language && variant) {
          generateForSpecific(request);
        } else {
          generateForAll(request);
        }
      });
    });
  }

  static addSampleCodeToOpenAPI(openAPIPath, outputAPIPath) {
    const openapiSchema = JSON.parse(fs.readFileSync(openAPIPath).toString());
    const sampleCode = {};

    fs.readdirSync('sample_code').forEach(file => {
      const code = fs.readFileSync(`sample_code/${file}`).toString();
      const operationId = file.replace('.pm', '');
      sampleCode[operationId] = code;
    });

    Object.keys(openapiSchema.paths).forEach(pathKey => {
      const path = openapiSchema.paths[pathKey];
      Object.keys(path).forEach(method => {
        const key222 = path[method].operationId;
        console.log(path[method], sampleCode.hasOwnProperty(key222));
        if (path[method].operationId && sampleCode[path[method].operationId]) {
          path[method]['x-sample-code'] = sampleCode[path[method].operationId];
          console.log("path[method]['x-sample-code']", path[method]);
        }
      });
    });
    console.log("outputAPIPath", outputAPIPath);
    fs.writeFileSync(outputAPIPath, JSON.stringify(openapiSchema, null, 2));
  }
}

module.exports = OpenAPIHelper;
