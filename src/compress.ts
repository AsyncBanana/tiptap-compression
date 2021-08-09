import { _defaultTypeNames, _defaultMarkNames } from "./enums";
import { Packr } from "msgpackr";
import { Options, defaultOptions, Node } from "./types";
const messagePack = new Packr({});
function _optimizeNode(obj: Node): Node {
	// heading size opt
	if (obj.type === "heading" && obj.attrs?.level) {
		obj.type = `heading${obj.attrs.level}`;
		obj.attrs.level = undefined;
	}
	// use type enum
	if (_defaultTypeNames[obj.type] === undefined) {
		throw new Error(
			`No type enum for element with type ${obj.type}. Please add this the custom element type dictionary, or file an issue if you think ${obj.type} should be included in the default dictionary`
		);
	}
	obj.type = _defaultTypeNames[obj.type];
	// use mark enum
	for (const mark in obj.marks) {
		if (_defaultMarkNames[obj.marks[mark].type] === undefined) {
			throw new Error(
				`No type enum for mark with type ${obj.marks[mark].type}. Please add this the custom mark type dictionary, or file an issue if you think ${obj.marks[mark].type} should be included in the default dictionary`
			);
		}
	}
	if (obj.content) {
		for (const child in obj.content) {
			obj.content[child] = _optimizeNode(obj.content[child]);
		}
	}
	return obj;
}
export default function Compress(obj: Node, Options: Options = {}): Buffer {
	Options = Object.assign({}, defaultOptions, Options);
	if (Options.optimize) {
		obj = _optimizeNode(obj);
	}
	return messagePack.pack(obj);
}
