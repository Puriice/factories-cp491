import { PropsWithChildren } from "react";
import style from "./scss/Count.module.scss";

function Count(props: PropsWithChildren<{ className?: string }>) {
    return (
        <div className={`${style.root} ${props.className}`}>
            {props.children}
        </div>
    );
}

export default Count;
