export interface ResourceNode {
	name: string;
	purity: "Pure" | "Normal" | "Impure";
	resource: string;
	latitude: number;
	longitude: number;
}