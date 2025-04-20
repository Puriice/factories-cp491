export type ResourceName = "Iron" | "Copper" | "Coal" | "Wood"

export interface ResourceNode {
	name: ResourceName;
	purity: "Pure" | "Normal" | "Impure";
	resource: string;
	latitude: number;
	longitude: number;
}