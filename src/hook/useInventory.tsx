import { useState } from "react";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GameInventoryService, {
    InventoryItem,
} from "../services/GameInventoryService";

export async function query<R>(
    userId: string,
    layer: FeatureLayer,
    outFields: string[],
    where: string = "1 = 1"
): Promise<R[]> {
    const featureSet = await layer.queryFeatures({
        where: `owner = '${userId}' AND ${where}`,
        outFields,
        returnGeometry: false,
    });

    const { features } = featureSet;

    if (!features || !features.length) return [];

    return features.map(({ attributes }) => attributes);
}

export type InventoryList = InventoryItem[];
export type DeleteItem = (objectId: number) => Promise<boolean>;

export type useInventoryReturns = [InventoryList, DeleteItem];

export default function useIntentory(): useInventoryReturns {
    const inventoryService = new GameInventoryService();

    const [inventory, setInventory] = useState<InventoryItem[]>(
        inventoryService.getItems()
    );

    async function deleteItem(objectId: number) {
        setInventory((value) => {
            return value.filter((item) => item.OBJECTID != objectId);
        });

        const status = await inventoryService.deleteItem(objectId);

        if (status) return true;

        setInventory(inventoryService.getItems());

        return false;
    }

    return [inventory, deleteItem];
}
