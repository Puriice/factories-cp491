import Item from "./Item";
import style from "./scss/Inventory.module.scss";
import gameConfig from "../../../config/game.json";
import useInventory from "../../hook/useInventory";
import people from "../../assets/img/people.png";
import { useState } from "react";
import useCoin from "../../hook/useCoin";

function Inventory() {
    const [coin] = useCoin();
    const [inventory, deleteItem] = useInventory();

    const [checked, setChecked] = useState("");

    const items = inventory.concat(
        Array(gameConfig.inventorySize - inventory.length).fill(null)
    );

    const randomValue = () => {
        const array = new Uint32Array(10);
        globalThis.crypto.getRandomValues(array);

        return array.join();
    };

    return (
        <div className={style.root}>
            <div className={style.coins}>
                <div className={style.coin}>
                    <img src={people} alt="" className={style.coin__img} />
                    <div className={style.coin__name}>Workers</div>
                    <div className={style.coin__info}>
                        <span className={style.coin__using}>
                            {coin?.avaliable}
                        </span>
                        /{coin?.total}
                    </div>
                </div>
            </div>
            <div className={style.items}>
                {items.map((item, index) => {
                    const id = randomValue();
                    return (
                        <Item
                            key={id}
                            id={String(index)}
                            item={item}
                            checked={checked}
                            setChecked={setChecked}
                            deleteFn={deleteItem}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default Inventory;
