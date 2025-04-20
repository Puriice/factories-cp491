import { PropsWithChildren } from "react";
import style from "./scss/index.module.scss";

function ListItem(props: PropsWithChildren<ListItemProps>) {
    return (
        <div className={style.item}>
            <div className={style.name}>{props.name}</div>
            <div className={style.values}></div>
        </div>
    );
}

export default ListItem;

export interface ListItemProps {
    icon?: string;
    name: string;
    value: number;
    maxValue?: number;
}
