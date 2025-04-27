import style from "./scss/CraftingMenu.module.scss";

function CraftingListItem(props: CraftingListItemProps) {
    return (
        <div className={style.list__item} onClick={props.onClick}>
            <img className={style.list__img} src={props.icon} alt="" />
            <div className={style.list__name}>{props.name}</div>
        </div>
    );
}

export default CraftingListItem;

export interface CraftingListItemProps {
    name: string;
    icon: string;
    onClick: React.MouseEventHandler<HTMLDivElement>;
}
