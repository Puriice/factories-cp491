import { useEffect, useMemo, useState } from "react";
import { InventoryItem } from "../components/Inventory/Item";
import Copper from "../assets/img/resources/copper.png";
import Iron from "../assets/img/resources/iron.png";

export default function useIntentory() {
    const inventoryItem: InventoryItem[] = [
        {
            name: "Reinforced Iron Plate",
            count: 21,
            icon: Copper,
        },
        {
            name: "Iron",
            count: 12,
            icon: Iron,
        },
        {
            name: "Iron",
            count: 53,
            icon: Iron,
        },
        {
            name: "Copper",
            count: 21,
            icon: Copper,
        },
        {
            name: "Iron",
            count: 12,
            icon: Iron,
        },
        {
            name: "Iron",
            count: 53,
            icon: Iron,
        },
        {
            name: "Copper",
            count: 21,
            icon: Copper,
        },
        {
            name: "Iron",
            count: 12,
            icon: Iron,
        },
        {
            name: "Iron",
            count: 53,
            icon: Iron,
        },
        {
            name: "Copper",
            count: 21,
            icon: Copper,
        },
        {
            name: "Iron",
            count: 12,
            icon: Iron,
        },
        {
            name: "Iron",
            count: 53,
            icon: Iron,
        },
        {
            name: "Copper",
            count: 21,
            icon: Copper,
        },
        {
            name: "Iron",
            count: 12,
            icon: Iron,
        },
        {
            name: "Iron",
            count: 53,
            icon: Iron,
        },
        {
            name: "Copper",
            count: 21,
            icon: Copper,
        },
        {
            name: "Iron",
            count: 12,
            icon: Iron,
        },
        {
            name: "Iron",
            count: 53,
            icon: Iron,
        },
    ];

    const item = useMemo(() => inventoryItem, []);

    const [inventory, setInventory] = useState(item);

    useEffect(() => {
        setInventory(item);
    }, [item]);

    return inventory;
}
