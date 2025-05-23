import React, { useMemo } from "react";
import style from "./scss/Inventory.module.scss";
import { DeleteItem } from "../../hook/useInventory";
import { Item } from "../../services/GameInventoryService";
import Count from "../Count";
function ItemSlot(props: ItemProps) {
    const { item } = props;
    const { checked, setChecked } = props;

    const status = useMemo(() => checked, [checked]);

    if (item == null) {
        return <div className={`${style.item} ${style.empty}`} />;
    }

    const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.button !== 2) {
            setChecked("");
            return;
        }
        event.preventDefault();
        setChecked(props.id);
    };

    return (
        <div className={style.item} onClick={onClick} onContextMenu={onClick}>
            <input
                type="checkbox"
                checked={status == props.id}
                className={style.checkbox}
                readOnly
            />
            <div className={style.lists}>
                <button
                    className={style.btn}
                    onClick={() => props.deleteFn(item.OBJECTID)}
                >
                    Delete
                </button>
            </div>
            <div className={style.name}>{item.name}</div>
            <Count className={style.count}>{item.n}</Count>
            <img className={style.icon} src={item.icon} alt="" />
        </div>
    );
}

export default ItemSlot;

export interface ItemProps {
    id: string;
    item: Item | null;
    checked: string;
    setChecked: React.Dispatch<React.SetStateAction<string>>;
    deleteFn: DeleteItem;
}
