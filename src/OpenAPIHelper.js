const fs = require('fs');
const { Collection, Item } = require('postman-collection');
const codegen = require('postman-code-generators');
const { execSync } = require('child_process');
const yaml = require('js-yaml');
const path = require('path');

class OpenAPIHelper {
  static convertOpenAPIToPostman(openAPIPath, postmanOutputPath) {
    execSync(`openapi2postmanv2 -s ${openAPIPath} -o ${postmanOutputPath}`, { stdio: 'inherit' });
  }

  static getSupportedLanguagesAndVariants() {
    const languages = codegen.getLanguageList();
    const supportedLanguages = [];
    languages.forEach(lang => lang.variants.forEach(vari => supportedLanguages.push({ language: lang.key, variant: vari.key }))) ;
    return supportedLanguages;
  }

  static generateSampleCode(postmanCollectionPath, language = null, variant = null) {

    
    const collection = JSON.parse(fs.readFileSync(postmanCollectionPath).toString());

    if (!fs.existsSync('/tmp/sample_code')) {
      fs.mkdirSync('/tmp/sample_code');
    }

    const generateForAll = (request, operationId) => {
      codegen.getLanguageList().forEach(lang => {
        lang.variants.forEach(vari => {
          codegen.convert(lang.key, vari.key, request, {}, (error, snippet) => {
            if (error) {
              console.error(error);
            } else {
              const fileName = `${operationId}~${lang.key}~${vari.key}.pm`;
              fs.writeFileSync(`/tmp/sample_code/${fileName}`, snippet);
            }
          });
        });
      });
    };

    const generateForSpecific = (request, operationId) => {
      codegen.convert(language, variant, request, {}, (error, snippet) => {
        if (error) {
          console.error(error);
        } else {
          const fileName = `${operationId}_${language}_${variant}.pm`;
          fs.writeFileSync(`/tmp/sample_code/${fileName}`, snippet);
        }
      });
    };

    function getOperationId(item) {
      const name = item.request.name.toLowerCase().split(" "); // eg: "Users List" -> ["users", "list"]
      const url = item.request.url.path; // eg: ["api", "v1", "users"]
      const method = item.request.method.toLowerCase(); // eg: "get"
      const operationId = `${name.join('_')}_${url.join('_')}_${method}`;
      return operationId;
    }

    function processItems(items) {
      items.forEach(item => {
        if (item.item) {
          processItems(item.item);
        } else {
          const request = new Item(item).request;
          const operationId = getOperationId(item);
          if (language && variant) {
            generateForSpecific(request, operationId);
          } else {
            generateForAll(request, operationId);
          }
        }
      });
    }

    processItems(collection.item);
  }

  static addSampleCodeToOpenAPI(openAPIPath, outputAPIPath) {
    let openapiSchema;
    const ext = path.extname(openAPIPath);

    if (ext === '.yaml' || ext === '.yml') {
      openapiSchema = yaml.load(fs.readFileSync(openAPIPath, 'utf8'));
    } else {
      openapiSchema = JSON.parse(fs.readFileSync(openAPIPath).toString());
    }

    const sampleCode = {};

    fs.readdirSync('/tmp/sample_code').forEach(file => {
      const code = fs.readFileSync(`/tmp/sample_code/${file}`).toString();
      const [operationId, lang, vari] = file.replace('.pm', '').split('~');
      if (!sampleCode[operationId]) {
        sampleCode[operationId] = [];
      }
      sampleCode[operationId][`${lang}_${vari}`] = code;
      sampleCode[operationId].push({
        lang: lang,
        source: code,
        label: `${lang}(${vari})`
      });
    });

    Object.keys(openapiSchema.paths).forEach(pathKey => {
      const path = openapiSchema.paths[pathKey];
      Object.keys(path).forEach(method => {
        const operationId = path[method].operationId;
        if (operationId && sampleCode[operationId]) {
          path[method]['x-codeSamples'] = sampleCode[operationId];
        }
      });
    });

    if (ext === '.yaml' || ext === '.yml') {
      fs.writeFileSync(outputAPIPath, yaml.dump(openapiSchema));
    } else {
      fs.writeFileSync(outputAPIPath, JSON.stringify(openapiSchema, null, 2));
    }
  }
}

module.exports = OpenAPIHelper;
