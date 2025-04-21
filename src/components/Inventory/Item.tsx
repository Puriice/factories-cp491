import style from "./scss/Inventory.module.scss";
function Item(props: ItemProps) {
    const { item } = props;
    if (item == null) {
        return <div className={style.item} />;
    }
    return (
        <div className={style.item}>
            <div className={style.count}>{item.count}</div>
            <img src={item.icon} alt="" />
        </div>
    );
}

export default Item;

export interface InventoryItem {
    icon: string;
    name: string;
    count: number;
}

export interface ItemProps {
    item: InventoryItem | null;
}
