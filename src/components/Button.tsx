import { ButtonHTMLAttributes } from "react";
import style from "./scss/Button.module.scss";

function Button(props: ButtonHTMLAttributes<HTMLButtonElement> & ButtonProps) {
    return (
        <button {...props} className={`${style.root} ${props.className}`}>
            {props.children}
        </button>
    );
}

export default Button;

export interface ButtonProps {
    icon?: string;
}
