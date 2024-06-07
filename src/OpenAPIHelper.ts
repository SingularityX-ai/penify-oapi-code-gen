import * as fs from 'fs';
import { Collection } from 'postman-collection';
import * as codegen from 'postman-code-generators';
import { execSync } from 'child_process';

class OpenAPIHelper {
  static convertOpenAPIToPostman(openAPIPath: string, postmanOutputPath: string): void {
    execSync(`openapi2postmanv2 -s ${openAPIPath} -o ${postmanOutputPath}`, { stdio: 'inherit' });
  }

  static generateSampleCode(postmanCollectionPath: string, language: string = 'python-http.client'): void {
    const collection = JSON.parse(fs.readFileSync(postmanCollectionPath).toString());

    if (!fs.existsSync('sample_code')) {
      fs.mkdirSync('sample_code');
    }

    collection.item.forEach((item: any) => {
      item.item.forEach((subItem: any) => {
        const request = new Collection.Item(subItem).request;

        codegen.convert(language, 'http.client', request, {}, (error: any, snippet: string) => {
          if (error) {
            console.error(error);
          } else {
            fs.writeFileSync(`sample_code/${subItem.name}.py`, snippet);
          }
        });
      });
    });
  }

  static addSampleCodeToOpenAPI(openAPIPath: string, outputAPIPath: string): void {
    const openapiSchema = JSON.parse(fs.readFileSync(openAPIPath).toString());
    const sampleCode: { [key: string]: string } = {};

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

export default OpenAPIHelper;
