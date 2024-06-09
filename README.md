# Penify Open API Code Gen

`penify-oapi-codegen` is a JavaScript library designed to convert OpenAPI schemas into various code examples. This tool simplifies the process of generating client libraries in different programming languages based on your API documentation.

## Features

- Convert OpenAPI schema to code examples in multiple languages.
- Easy to use command-line interface.

## Prerequisites

Before installing `penify-oapi-codegen`, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 12 or higher)
- npm (Node package manager)

Additionally, you need to install `openapi-to-postmanv2` globally. This can be done using the following command:

```bash
npm install -g openapi-to-postmanv2
```

## Installation

To install `penify-oapi-codegen`, run the following command:

```bash
npm install penify-oapi-codegen
```

## Usage

Once installed, you can use `penify-oapi-codegen` from the command line to generate code examples from your OpenAPI schemas.

### Generate Code Examples

```bash
penify-oapi-codegen -i path/to/your/openapi/schema.json -l language -v variant -o path/to/output/schema_with_code.json
```

### Options

- `-s, --source <path>`: Path to the OpenAPI schema file (required).
- `-l, --language <language>`: Programming language for the code example (optional).
- `-v, --variant <variant>`: Variant of the code generator for the specified language (optional).
- `-o, --output <path>`: Path to the output code example file (optional).
- `-s,`: To show list of supported languages

## Supported Code Generators

The tool supports generating code examples for the following languages and variants:

| Language       | Variant        |
|--------------- |----------------|
| csharp         | RestSharp      |
| curl           | cURL           |
| go             | Native         |
| http           | HTTP           |
| java           | OkHttp         |
| java           | Unirest        |
| javascript     | Fetch          |
| javascript     | jQuery         |
| javascript     | XHR            |
| c              | libcurl        |
| nodejs         | Axios          |
| nodejs         | Native         |
| nodejs         | Request        |
| nodejs         | Unirest        |
| objective-c    | NSURLSession   |
| ocaml          | Cohttp         |
| php            | cURL           |
| php            | HTTP_Request2  |
| php            | pecl_http      |
| powershell     | RestMethod     |
| python         | http.client    |
| python         | Requests       |
| ruby           | Net::HTTP      |
| shell          | Httpie         |
| shell          | wget           |
| swift          | URLSession     |

## Examples

### Example 1: Generate Python Requests Code Example

```bash
penify-oapi-codegen -s ./schemas/api.json -l python -v Requests -o ./examples/schema_python_requests_example.json
```

### Example 2: Generate JavaScript Fetch Code Example

```bash
penify-oapi-codegen -s ./schemas/api.json -l javascript -v Fetch -o ./examples/schema_js_fetch_example.json
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with your changes.

## License

This project is licensed under the ISC License.

## Author

sumansaurabh

---

*Footnote: This tool uses `openapi-to-postmanv2` for converting OpenAPI schemas. Please ensure it is installed globally.*
