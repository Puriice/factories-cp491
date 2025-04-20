import { PropsWithChildren } from "react";
import ListItem from "./ListItem";
import style from "./scss/index.module.scss";

function List(props: PropsWithChildren<ListProps>) {
    return (
        <div className={style.root}>
            {Object.entries(props.items).map(([name, value]) => {
                if (typeof value == "number") {
                    return <ListItem name={name} value={value} />;
                }

                return (
                    <ListItem
                        name={name}
                        value={value.value}
                        maxValue={value.maxValue}
                    />
                );
            })}
        </div>
    );
}

export default List;

export interface ListProps {
    items: {
        [name: string]:
            | number
            | {
                  value: number;
                  icon?: string;
                  maxValue?: number;
              };
    };
}
