# grpc-pbf-loader

[![npm version](https://badge.fury.io/js/grpc-pbf-loader.svg)](https://www.npmjs.com/package/grpc-pbf-loader)
[![npm downloads](https://img.shields.io/npm/dt/grpc-pbf-loader.svg)](https://www.npmjs.com/package/grpc-pbf-loader)
[![dependencies](https://img.shields.io/david/litichevskiydv/grpc-pbf-loader.svg)](https://www.npmjs.com/package/grpc-pbf-loader)
[![dev dependencies](https://img.shields.io/david/dev/litichevskiydv/grpc-pbf-loader.svg)](https://www.npmjs.com/package/grpc-pbf-loader)
[![Build Status](https://github.com/litichevskiydv/grpc-pbf-loader/actions/workflows/ci.yaml/badge.svg?branch=master)](https://github.com/litichevskiydv/grpc-pbf-loader/actions/workflows/ci.yaml)
[![Coverage Status](https://coveralls.io/repos/github/litichevskiydv/grpc-pbf-loader/badge.svg?branch=master)](https://coveralls.io/github/litichevskiydv/grpc-pbf-loader?branch=master)

A utility package for loading `.proto` files for use with gRPC, using [pbf](https://github.com/mapbox/pbf) as a serializer.

## Installation

```sh
npm i grpc-pbf-loader
```

## Usage

```js
const packageDefinitionLoader = require("grpc-pbf-loader").packageDefinition;
const grpcLibrary = require("grpc");
// OR
const grpcLibrary = require("@grpc/grpc-js");

const packageDefinition = await packageDefinitionLoader.load(protoFileName, options);
const packageObject = grpcLibrary.loadPackageDefinition(packageDefinition);
// OR
const packageDefinition = packageDefinitionLoader.loadSync(protoFileName, options);
const packageObject = grpcLibrary.loadPackageDefinition(packageDefinition);
```

The options parameter is an object that can have the following optional properties:

| Field name    | Valid values        | Description                                                        |
| ------------- | ------------------- | ------------------------------------------------------------------ |
| `keepCase`    | `true` or `false`   | Preserve field names. The default is to change them to camel case. |
| `includeDirs` | An array of strings | A list of search paths for imported `.proto` files.                |
