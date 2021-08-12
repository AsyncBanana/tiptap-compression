export interface Options {
	optimize?: true;
	deepCopy?: true;
	zstd?: true;
}
export const defaultOptions: Options = {
	optimize: true,
	zstd: true
};
export interface Mark {
	type: string | number;
}
export interface Node {
	type: string;
	marks?: [Mark];
	text?: string;
	content?: [Node];
	attrs?: Record<string, unknown>;
}
export interface OptNode {
	a: number; // type
	b?: string; // text
	c?: any; // content
	d?: [Mark]; // marks
	e?: Record<string, unknown>; // attrs
}
