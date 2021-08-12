/* eslint-disable no-undef */
import {
	Compress as Compressor,
	Decompress as Decompressor
} from "../dist/index.modern";
const testData = {
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
test("compress and decompress the same json to get the same result", async () => {
	const Compress = new Compressor({ deepCopy: true });
	const Decompress = new Decompressor({ deepCopy: true });
	expect(
		await Decompress.Decompress(await Compress.Compress(testData))
	).toStrictEqual(testData);
});
