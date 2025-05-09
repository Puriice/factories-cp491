import Item from "./ItemSlot";
import style from "./scss/Inventory.module.scss";
import gameConfig from "../../../config/game.json";
import { DeleteItem, InventoryList } from "../../hook/useInventory";
import people from "../../assets/img/people.png";
import { useEffect, useMemo, useState } from "react";
import useWorker from "../../hook/useWorker";
import useWorkerAssignment from "../../hook/useWorkerAssignment";

function Inventory(props: InventoryProps) {
    const { worker } = useWorker();
    const { occupiedWorker } = useWorkerAssignment();
    const { inventory, deleteItem } = props.inventory;

    const [checked, setChecked] = useState("");

    const defaultItems = useMemo(
        () =>
            inventory.concat(
                Array(gameConfig.inventorySize - inventory.length).fill(null)
            ),
        [inventory]
    );

    const [items, setItems] = useState(defaultItems);
    const [search, setSearchValue] = useState("");

    useEffect(() => {
        setItems(defaultItems);
    }, [defaultItems]);

    const randomValue = () => {
        const array = new Uint32Array(10);
        globalThis.crypto.getRandomValues(array);

        return array.join();
    };

    const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        const { value } = event.target;
        setSearchValue(value);

        if (value == "") {
            setItems(defaultItems);
            return;
        }

        const loweredSearch = value.toLowerCase().trim();

        const filteredItems = inventory.filter((item) =>
            item.name.toLowerCase().includes(loweredSearch)
        );

        const isRepeated =
            inventory.length == filteredItems.length &&
            inventory.every((value, i) => {
                return Object.is(value, filteredItems[i]);
            });

        if (isRepeated) return;

        setItems(() => {
            return filteredItems.concat(
                Array(gameConfig.inventorySize - filteredItems.length).fill(
                    null
                )
            );
        });
    };

    return (
        <div className={style.root}>
            <div className={style.coins}>
                <div className={style.coin}>
                    {worker.avaliable != worker.total ? (
                        <div className={style.coin__popup}>
                            <ul className={style.coin__popup__list}>
                                {occupiedWorker.map((worker) => (
                                    <li key={worker.OBJECTID}>
                                        {worker.targetName}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <></>
                    )}
                    <img src={people} alt="" className={style.coin__img} />
                    <div className={style.coin__name}>Workers</div>
                    <div className={style.coin__info}>
                        <span className={style.coin__using}>
                            {worker.avaliable}
                        </span>
                        /{worker.total}
                    </div>
                </div>
            </div>
            <div className={style.search__box}>
                <input
                    type="text"
                    placeholder="Search Inventory"
                    className={style.search__input}
                    value={search}
                    onChange={onChange}
                />
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

export interface InventoryProps {
    inventory: {
        inventory: InventoryList;
        deleteItem: DeleteItem;
    };
}
