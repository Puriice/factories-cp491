import { useState } from "react";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GameInventoryService, { Item } from "../services/GameInventoryService";
import gameConfig from "../../config/game.json";

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

export type InventoryList = Item[];
export type DeleteItem = (objectId: number) => Promise<boolean>;
export type AppendItem = (name: string, n: number) => Promise<boolean>;

export type useInventoryReturns = {
    inventory: InventoryList;
    deleteItem: DeleteItem;
    appendItem: AppendItem;
};

export default function useIntentory(): useInventoryReturns {
    const inventoryService = new GameInventoryService();

    const [inventory, setInventory] = useState<Item[]>(
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

    async function appendItem(name: string, n: number) {
        if (inventory.length >= gameConfig.inventorySize) return false;

        setInventory((value) => {
            const { items } = inventoryService.getOptimisticAppendItem(
                value,
                name,
                n
            );

            return [...items];
        });

        const result = await inventoryService.appendItem(name, n);

        setInventory(inventoryService.getItems());

        return result;
    }

    return { inventory, deleteItem, appendItem };
}
