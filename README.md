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
penify-oapi-codegen -s path/to/your/openapi/schema.yaml -l language -v variant -o path/to/output/code_example
```

### Options

- `-s, --source <path>`: Path to the OpenAPI schema file (required).
- `-l, --language <language>`: Programming language for the code example (optional).
- `-v, --variant <variant>`: Variant of the code generator for the specified language (optional).
- `-o, --output <path>`: Path to the output code example file (optional).

## Supported Code Generators

The tool supports generating code examples for the following languages and variants:

| Language      | Variant       |
|---------------|---------------|
| C             | libcurl       |
| C#            | HttpClient    |
| C#            | RestSharp     |
| cURL          | cURL          |
| Dart          | http          |
| Go            | Native        |
| HTTP          | HTTP          |
| Java          | OkHttp        |
| Java          | Unirest       |
| JavaScript    | Fetch         |
| JavaScript    | jQuery        |
| JavaScript    | XHR           |
| Kotlin        | OkHttp        |
| NodeJs        | Axios         |
| NodeJs        | Native        |
| NodeJs        | Request       |
| NodeJs        | Unirest       |
| Objective-C   | NSURLSession  |
| OCaml         | Cohttp        |
| PHP           | cURL          |
| PHP           | Guzzle        |
| PHP           | pecl_http     |
| PHP           | HTTP_Request2 |
| PowerShell    | RestMethod    |
| Python        | http.client   |
| Python        | Requests      |
| R             | httr          |
| R             | RCurl         |
| Rust          | Reqwest       |
| Ruby          | Net:HTTP      |
| Shell         | Httpie        |
| Shell         | wget          |
| Swift         | URLSession    |

## Examples

### Example 1: Generate Python Requests Code Example

```bash
penify-oapi-codegen -s ./schemas/api.yaml -l Python -v Requests -o ./examples/python_requests_example.py
```

### Example 2: Generate JavaScript Fetch Code Example

```bash
penify-oapi-codegen -s ./schemas/api.yaml -l JavaScript -v Fetch -o ./examples/js_fetch_example.js
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with your changes.

## License

This project is licensed under the ISC License.

## Author

sumansaurabh

---

*Footnote: This tool uses `openapi-to-postmanv2` for converting OpenAPI schemas. Please ensure it is installed globally.*
