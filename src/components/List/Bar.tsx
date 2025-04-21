import React from "react";
import style from "./scss/List.module.scss";

function Bar(props: BarProps) {
    return (
        <div className={style.bar}>
            <div
                className={style.slider}
                style={
                    {
                        "--percent": `${Math.min(
                            (props.value / (props.max ?? props.value)) * 100,
                            100
                        )}%`,
                    } as React.CSSProperties
                }
            ></div>
        </div>
    );
}

export default Bar;

export interface BarProps {
    value: number;
    max?: number;
}
