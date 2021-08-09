export interface Options {
	optimize?: true;
}
export const defaultOptions: Options = {
	optimize: true
};
export interface Mark {
	[key: string]: any;
	type: string | number;
}
export interface Node {
	[key: string]: any;
	type: string | number;
	marks: [Mark];
	text?: string;
	content?: [Node];
	attrs: Record<string, unknown>;
}
