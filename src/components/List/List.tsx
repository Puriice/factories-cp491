import { PropsWithChildren } from "react";
import ListItem from "./ListItem";
import style from "./scss/List.module.scss";

function List(props: PropsWithChildren<ListProps>) {
    return (
        <div className={style.root}>
            {Object.entries(props.items).map(([name, value]) => {
                if (typeof value == "number") {
                    return <ListItem key={name} name={name} value={value} />;
                }

                return (
                    <ListItem
                        key={name}
                        name={name}
                        value={value.value}
                        maxValue={value.maxValue}
                        icon={value.icon}
                    />
                );
            })}
        </div>
    );
}

export default List;

export interface ListItem {
    value: number;
    icon?: string;
    maxValue?: number;
}

export interface ListProps {
    items: Record<string, number | ListItem>;
}
