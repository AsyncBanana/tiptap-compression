import { add, complete, suite, cycle } from "benny";
import { Compress } from "../dist/index.modern.js";
let sizes = {};
let testCode = () => {
	return {
		type: "doc",
		content: [
			{
				type: "paragraph",
				content: [
					{
						type: "text",
						text: "Lorem ipsum color."
					}
				]
			},
			{
				type: "heading",
				attrs: {
					level: 1
				},
				content: [
					{
						type: "text",
						text: "Heading test"
					}
				]
			},
			{
				type: "paragraph",
				content: [
					{
						type: "text",
						marks: [
							{
								type: "bold"
							}
						],
						text: "bold text"
					}
				]
			}
		]
	};
};
suite(
	"Serialization Performance",
	add("Compress with optimizations and msgpack", () => {
		sizes["Compressed with optimizations and messagePack"] = Compress(
			testCode()
		).byteLength;
	}),
	add("Compress with messagePack", () => {
		sizes["Compressed with messagePack"] = Compress(testCode()).byteLength;
	}),
	add("Stringify JSON", () => {
		sizes["Stringify JSON"] = JSON.stringify(testCode()).length;
	}),
	cycle(),
	complete()
);
let sizeString = "Sizes\n------";
for (let sizeKey in sizes) {
	sizeString += `\n${sizeKey}: ${sizes[sizeKey]}`;
}
console.log(sizeString);
