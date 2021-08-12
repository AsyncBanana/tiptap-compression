import { _defaultTypeNames, _defaultMarkNames } from "./enums";
import { Packr } from "msgpackr";
import { init, compress } from "@bokuweb/zstd-wasm";
import { Options, defaultOptions, Node, OptNode } from "./types";
const messagePack = new Packr({});
function deepCopy(src: Node): any {
	const target = Array.isArray(src) ? [] : {};
	for (const prop in src) {
		const value = src[prop];
		if (value && typeof value === "object") {
			target[prop] = deepCopy(value);
		} else {
			target[prop] = value;
		}
	}
	return target;
}
export default class Compressor {
	constructor(Options: Options) {
		this.#options = Object.assign({}, defaultOptions, Options);
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
	#optimizeNode(obj: Node): OptNode {
		const newObj: OptNode = { a: 0, d: obj.marks, e: obj.attrs, b: obj.text };
		// use type enum
		// heading size opt
		if (obj.type === "heading" && obj.attrs?.level) {
			newObj.a = _defaultTypeNames[`heading${obj.attrs.level}`];
			newObj.e.level = undefined;
		} else {
			if (_defaultTypeNames[obj.type] === undefined) {
				throw new Error(
					`No type enum for element with type ${obj.type}. Please add this the custom element type dictionary, or file an issue if you think ${obj.type} should be included in the default dictionary`
				);
			}
			newObj.a = _defaultTypeNames[obj.type];
		}
		// use mark enum
		for (const mark in obj.marks) {
			if (_defaultMarkNames[obj.marks[mark].type] === undefined) {
				throw new Error(
					`No type enum for mark with type ${obj.marks[mark].type}. Please add this the custom mark type dictionary, or file an issue if you think ${obj.marks[mark].type} should be included in the default dictionary`
				);
			}
			newObj.d[mark].type = _defaultMarkNames[obj.marks[mark].type];
		}
		if (obj.content) {
			newObj.c = [];
			for (const child in obj.content) {
				newObj.c[child] = this.#optimizeNode(obj.content[child]);
			}
		}
		return newObj;
	}
	async Compress(obj: Node): Promise<Uint8Array> {
		if (this.#options.deepCopy) {
			obj = deepCopy(obj);
		}
		if (this.#options.zstd && this.zstdFinished !== true) {
			await this.zstdFinished;
		}
		const packed = messagePack.pack(
			this.#options.optimize ? this.#optimizeNode(obj) : obj
		);
		return this.#options.zstd ? compress(packed) : packed;
	}
}
