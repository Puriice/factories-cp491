import { useState } from "react";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GameInventoryService, { Item } from "../services/GameInventoryService";
import gameConfig from "../../config/game.json";
import { Recipe } from "../services/GameRecipeService";

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
export type PopItem = (name: string, n: number) => Promise<boolean>;
export type CraftItem = (recipe: Recipe) => Promise<boolean>;

export type useInventoryReturns = {
    inventory: InventoryList;
    deleteItem: DeleteItem;
    appendItem: AppendItem;
    popItem: PopItem;
    craftItem: CraftItem;
    craftingStatus: boolean;
};

export default function useIntentory(): useInventoryReturns {
    const inventoryService = new GameInventoryService();

    const [inventory, setInventory] = useState<Item[]>(
        inventoryService.getItems()
    );

    const [craftingStatus, setCraftingStatus] = useState<boolean>(false);

    async function deleteItem(objectId: number) {
        setInventory((value) => {
            return value.filter((item) => item.OBJECTID != objectId);
        });

        const status = await inventoryService.deleteItem(objectId);

        if (status) return true;

        setInventory(() => {
            return [...inventoryService.getItems()];
        });

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

        setInventory(() => {
            return [...inventoryService.getItems()];
        });

        return result;
    }

    async function popItem(name: string, n: number) {
        setInventory((value) => {
            const { items } = inventoryService.getOptimisticPopItem(
                value,
                name,
                n
            );

            return [...items];
        });

        const result = await inventoryService.popItem(name, n);

        setInventory(() => {
            return [...inventoryService.getItems()];
        });

        return result;
    }

    async function craftItem(recipe: Recipe) {
        setCraftingStatus(true);
        recipe.inputs.forEach(async (input) => {
            await popItem(input.name, input.n);
        });

        await appendItem(recipe.produce, recipe.n);

        setCraftingStatus(false);
        return true;
    }

    return {
        inventory,
        deleteItem,
        appendItem,
        popItem,
        craftItem,
        craftingStatus,
    };
}
