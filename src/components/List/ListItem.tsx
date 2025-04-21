import { PropsWithChildren } from "react";
import style from "./scss/List.module.scss";
import Bar from "./Bar";

function ListItem(props: PropsWithChildren<ListItemProps>) {
    return (
        <div className={style.item}>
            <img src={props.icon} alt="" className={style.icon} />
            <div className={style.detail}>
                <div className={style.meta}>
                    <div className={style.name}>{props.name}</div>
                    <div className={style.values}>
                        {props.value}{" "}
                        {props.maxValue ? `/${props.maxValue}` : ""}
                    </div>
                </div>
                <Bar value={props.value} max={props.maxValue} />
            </div>
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
