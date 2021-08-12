import { add, complete, suite, cycle } from "benny";
import { Compress as Compressor } from "../dist/index.modern.js";
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
	add("Compress with optimizations and msgpack", async () => {
		const Compress = new Compressor();
		await Compress.zstdFinished;
		return async () => {
			sizes["Compressed with optimizations and messagePack"] = (
				await Compress.Compress(testCode())
			).byteLength;
		};
	}),
	add("Compress with optimizations and msgpack (deep copy)", async () => {
		const Compress = new Compressor({
			deepCopy: true
		});
		await Compress.zstdFinished;
		return async () => {
			sizes["Compressed with optimizations and messagePack (deep copy)"] = (
				await Compress.Compress(testCode())
			).byteLength;
		};
	}),
	add("Compress with messagePack", async () => {
		const Compress = new Compressor({
			optimize: false
		});
		await Compress.zstdFinished;
		return async () => {
			sizes["Compressed with messagePack"] = (
				await Compress.Compress(testCode())
			).byteLength;
		};
	}),
	add("Stringify JSON", () => {
		sizes["Stringify JSON"] = JSON.stringify(testCode()).length;
	}),
	cycle(),
	complete(),
	complete(() => {
		let sizeString = "Sizes\n------";
		for (let sizeKey in sizes) {
			sizeString += `\n${sizeKey}: ${sizes[sizeKey]}`;
		}
		// eslint-disable-next-line no-undef
		console.log(sizeString);
	})
);
