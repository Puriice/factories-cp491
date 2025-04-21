import { PropsWithChildren } from "react";
import Item, { InventoryItem } from "./Item";
import style from "./scss/Inventory.module.scss";
import gameConfig from "../../../config/game.json";

function Inventory(props: PropsWithChildren<InventoryProps>) {
    const items = props.items.concat(
        Array(gameConfig.inventorySize - props.items.length).fill(null)
    );

    console.log(typeof items);

    const randomValue = () => {
        const array = new Uint32Array(10);
        globalThis.crypto.getRandomValues(array);

        return array.join();
    };

    return (
        <div className={style.root}>
            {items.map((item) => (
                <Item key={randomValue()} item={item} />
            ))}
        </div>
    );
}

export default Inventory;
export interface InventoryProps {
    items: InventoryItem[];
}
