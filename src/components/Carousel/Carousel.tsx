import { Children } from "react";
import style from "./scss/Carousel.module.scss";

function Carousel(props: Props) {
    const childrenCount = Children.count(props.children);

    return (
        <div
            className={style.root + " " + props.className}
            style={
                {
                    "--count": childrenCount,
                    "--index": props.index % childrenCount,
                    "--gap": props.gapRem ? props.gapRem + "rem" : "1rem",
                } as React.CSSProperties
            }
        >
            <div className={style.sliding__window}>{props.children}</div>
        </div>
    );
}

export default Carousel;

export interface Props extends React.PropsWithChildren {
    index: number;
    className?: string;
    gapRem?: number;
}
