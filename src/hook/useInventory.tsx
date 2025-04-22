import { useState } from "react";
import inventoryLayer from "../layers/inventroyLayer";
import useLocalStorage from "./useLocalStorage";
import useRandom from "./useRandom";
import Graphic from "@arcgis/core/Graphic";

let inventroyItems: InventoryItem[] | null = null;

async function queryInventory(userId: string): Promise<InventoryItem[]> {
    const featureSet = await inventoryLayer.queryFeatures({
        where: `owner = '${userId}'`,
        outFields: ["OBJECTID", "name", "n", "icon"],
        returnGeometry: false,
    });

    const { features } = featureSet;

    if (!features.length) return [];

    return features.map(({ attributes }) => attributes);
}

export type InventoryList = Promise<InventoryItem[]>;
export type DeleteItem = (objectId: number[]) => Promise<__esri.EditsResult>;

export type useInventoryReturns = [InventoryList, DeleteItem];

export default function useIntentory(): useInventoryReturns {
    const [userId] = useLocalStorage("userid", useRandom());

    const [inventory, setInventory] = useState<Promise<InventoryItem[]>>(
        async () => {
            if (inventroyItems !== null) return inventroyItems;

            inventroyItems = await queryInventory(userId);

            return inventroyItems;
        }
    );

    async function deleteItem(objectId: number[]) {
        const result = await inventoryLayer.applyEdits({
            deleteFeatures: objectId.map(
                (id) =>
                    new Graphic({
                        attributes: {
                            OBJECTID: id,
                        },
                    })
            ),
        });

        inventroyItems = await queryInventory(userId);

        if (!inventroyItems) return result;

        setInventory(new Promise((res) => res(inventroyItems!)));

        return result;
    }

    return [inventory, deleteItem];
}

export interface InventoryItem {
    OBJECTID: number;
    name: string;
    n: number;
    icon: string;
}
