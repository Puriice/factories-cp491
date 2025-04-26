import { ButtonHTMLAttributes } from "react";
import style from "./scss/TabView.module.scss";

function TabButton(props: TabButtonProps) {
    return (
        <button {...props} className={`${style.button} ${props.className}`}>
            <img
                className={style.button__icon}
                src={props.button.icon}
                alt=""
            />
            <div className={style.button__name}>{props.button.key}</div>
        </button>
    );
}

export default TabButton;

export interface TabButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    button: {
        key: string;
        icon: string;
    };
}
