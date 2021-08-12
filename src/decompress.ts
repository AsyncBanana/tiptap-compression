import { _defaultTypeNames, _defaultMarkNames } from "./enums";
import { Packr } from "msgpackr";
import { init, decompress } from "@bokuweb/zstd-wasm";
import { Options, defaultOptions, Node, OptNode } from "./types";
const messagePack = new Packr({});
export default class Decompressor {
	constructor(Options: Options) {
		this.#options = Object.assign({}, defaultOptions, Options);
		// get reversed array for elements and marks
		this.typeNumbers = [];
		this.markNumbers = [];
		for (const key in _defaultTypeNames) {
			this.typeNumbers[_defaultTypeNames[key]] = key;
		}
		for (const key in _defaultMarkNames) {
			this.markNumbers[_defaultMarkNames[key]] = key;
		}
		if (this.#options.zstd) {
			this.zstdFinished = init();
			this.zstdFinished.then(() => {
				this.zstdFinished = true;
			});
		} else {
			this.zstdFinished = true;
		}
	}
	zstdFinished: Promise<void> | boolean;
	#options: Options;
	typeNumbers: any[];
	markNumbers: any[];
	#optimizeNode(obj: OptNode): Node {
		const newObj: Node = { type: "" };
		if (obj.d) {
			newObj.marks = obj.d;
		}
		if (obj.e) {
			newObj.attrs = obj.e;
		}
		if (obj.b) {
			newObj.text = obj.b;
		}
		// use type enum
		if (this.typeNumbers[obj.a] === undefined) {
			throw new Error(
				`No type enum for element with type ${obj.a}. Please add this the custom element type dictionary, or file an issue if you think ${obj.a} should be included in the default dictionary`
			);
		}
		newObj.type = this.typeNumbers[obj.a];
		// heading size opt
		if (newObj.type.startsWith("heading")) {
			newObj.attrs.level = parseInt(newObj.type.split("g").pop());
			newObj.type = "heading";
		}
		// optimize content
		if (obj.c) {
			newObj.content = obj.c;
			for (const child in obj.c) {
				newObj.content[child] = this.#optimizeNode(obj.c[child]);
			}
		}
		// use mark enum
		for (const mark in obj.d) {
			if (this.markNumbers[obj.d[mark].type] === undefined) {
				throw new Error(
					`No type enum for mark with type ${obj.d[mark].type}. Please add this the custom mark type dictionary, or file an issue if you think ${obj.d[mark].type} should be included in the default dictionary`
				);
			}
			newObj.marks[mark].type = this.markNumbers[obj.d[mark].type];
		}
		return newObj;
	}
	async Decompress(buffer: Buffer): Promise<Node> {
		if (this.#options.zstd && this.zstdFinished !== true) {
			await this.zstdFinished;
		}
		const packed = this.#options.zstd
			? messagePack.unpack(new Uint8Array(decompress(buffer)))
			: messagePack.unpack(buffer);
		return this.#options.optimize ? this.#optimizeNode(packed) : packed;
	}
}
