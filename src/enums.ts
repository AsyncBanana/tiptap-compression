export const _defaultTypeNames = {
	doc: 0,
	heading1: 1,
	heading2: 2,
	heading3: 3,
	heading4: 4,
	heading5: 5,
	heading6: 6,
	text: 7,
	paragraph: 8,
	image: 9,
	taskList: 10,
	taskItem: 11,
	table: 12,
	tableRow: 13,
	tableCell: 14,
	codeBlock: 15,
	bulletList: 16,
	orderedList: 17,
	hardBreak: 18,
	horizontalRule: 19,
	blockQuote: 20,
	emoji: 21,
	hashTag: 22,
	mention: 23,
	listItem: 24
} as const;
export const _defaultMarkNames = {
	bold: 0,
	italic: 1,
	code: 2,
	highlight: 3,
	link: 4,
	strike: 5,
	subscript: 6,
	superscript: 7,
	textstyle: 8,
	underline: 9
} as const;
export const _propertyNames = {
	type: "a",
	text: "b",
	content: "c",
	marks: "d"
} as const;
