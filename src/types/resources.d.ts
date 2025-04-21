export type ResourceName = "Iron" | "Copper" | "Coal" | "Wood"
export type Purities = "Pure" | "Normal" | "Impure";

export interface ResourceNode {
	name: string;
	purity: Purities;
	resource: ResourceName;
	latitude: number;
	longitude: number;
}