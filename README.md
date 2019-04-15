# vscode-wasm-extension-example

An example Visual Studio Code extension written in Rust and compiled to WASM

## Requirements

| requirement  |      | version                                                              | how to install                                                                 |
| ------------ | ---- | :------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| node         | `>=` | [`11.11.0`](https://github.com/nodejs/node/releases/tag/v11.11.0)    | manually or via package manager                                                |
| rust         | `>=` | [`1.33.0`](https://github.com/rust-lang/rust/releases/tag/1.33.0)    | use [rustup](https://rustup.rs/)                                               |
| vscode       | `>=` | [`1.32.0`](https://code.visualstudio.com/)                           | manually or via package manager                                                |
| wasm-pack    | `>=` | [`0.6.0`](https://github.com/rustwasm/wasm-pack/releases/tag/v0.6.0) | use the [wasm-pack installer](https://rustwasm.github.io/wasm-pack/installer/) |

## Building

```
$ npm install
$ cd crate
$ wasm-pack build
$ cd pkg
$ npm link
$ cd ../..
$ npm link vscode-wasm-module
$ <press F5 in vscode to compile and launch extension>
$ <open command palette in extension host and execute the "Hello WASM" command>
```
