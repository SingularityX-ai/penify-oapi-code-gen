// __tests__/OpenAPIHelper.test.js

const fs = require('fs');
const { execSync } = require('child_process');
const OpenAPIHelper = require('../src/OpenAPIHelper');

jest.mock('fs');
jest.mock('child_process');

describe('OpenAPIHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('convertOpenAPIToPostman', () => {
    it('should call execSync with the correct command', () => {
      const openAPIPath = 'openapi.json';
      const postmanOutputPath = '/tmp/openapi_schema_postman.json';

      OpenAPIHelper.convertOpenAPIToPostman(openAPIPath, postmanOutputPath);

      expect(execSync).toHaveBeenCalledWith(
        `openapi2postmanv2 -s ${openAPIPath} -o ${postmanOutputPath}`,
        { stdio: 'inherit' }
      );
    });
  });

  describe('generateSampleCode', () => {
    it('should generate code for all languages and variants if no specific language and variant are provided', () => {
      const postmanCollectionPath = '/tmp/postman_collection.json';
      const collection = {
        item: [
          {
            request: {
              name: 'Get Users',
              method: 'GET',
              url: { path: ['api', 'v1', 'users'] }
            }
          }
        ]
      };

      fs.readFileSync.mockReturnValue(JSON.stringify(collection));
      fs.existsSync.mockReturnValue(false);
      fs.mkdirSync.mockReturnValue();

      OpenAPIHelper.generateSampleCode(postmanCollectionPath);

      expect(fs.readFileSync).toHaveBeenCalledWith(postmanCollectionPath);
      expect(fs.mkdirSync).toHaveBeenCalledWith('/tmp/sample_code');
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should generate code for specific language and variant if provided', () => {
      const postmanCollectionPath = '/tmp/postman_collection.json';
      const collection = {
        item: [
          {
            request: {
              name: 'Get Users',
              method: 'GET',
              url: { path: ['api', 'v1', 'users'] }
            }
          }
        ]
      };

      fs.readFileSync.mockReturnValue(JSON.stringify(collection));
      fs.existsSync.mockReturnValue(true);

      OpenAPIHelper.generateSampleCode(postmanCollectionPath, 'nodejs', 'axios');

      expect(fs.readFileSync).toHaveBeenCalledWith(postmanCollectionPath);
      expect(fs.writeFileSync).toHaveBeenCalled();
    });
  });
});
