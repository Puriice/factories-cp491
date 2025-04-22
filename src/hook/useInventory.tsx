import { useEffect, useMemo, useState } from "react";
import inventoryLayer from "../layers/inventroyLayer";
import Graphic from "@arcgis/core/Graphic";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import useUserId from "./useUserId";

let inventroyItems: InventoryItem[] | null = null;

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
export type DeleteItem = (objectId: number[]) => Promise<__esri.EditsResult>;

export type useInventoryReturns = [InventoryList, DeleteItem];

export default function useIntentory(): useInventoryReturns {
    const userId = useUserId();
    const outFields = useMemo(() => ["OBJECTID", "name", "n", "icon"], []);

    const [inventory, setInventory] = useState<InventoryItem[]>([]);

    useEffect(() => {
        let isMounted = true;

        const loadInventory = async () => {
            const items = await query<InventoryItem>(
                userId,
                inventoryLayer,
                outFields
            );
            if (isMounted) {
                setInventory(items);
            }
        };

        loadInventory();

        return () => {
            isMounted = false;
        };
    }, [userId, outFields]);

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

        inventroyItems = await query(userId, inventoryLayer, outFields);

        if (!inventroyItems) return result;

        setInventory(inventroyItems);

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
