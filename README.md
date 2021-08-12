# TipTap Compression

TipTap compression is a simple library for compressing documents generated using the TipTap editing framework (or ProseMirror).

It has three main steps:

1. Optimization using number enums for type names and other optimizations like minifying property names

2. Serialization using msgpack

3. Compression using Zstandard with Zstd-Wasm

You are able to turn off steps 1 and 3

Docs and more configuration options will be created soon. Currently, you can look through the type declaration files for some explanation, and the code is fairly easy to read, and I will try to create actual docs and tutorials soon.
