import style from "./scss/Goal.module.scss";
import MissingTexture from "../../assets/img/missingTexture.png";
import ItemImages from "../../assets/ItemImages";
import Count from "../Count";

function GoalItem(props: GoalItemProps) {
    const icon = ItemImages[props.name] ?? MissingTexture;
    const percent = Math.min(
        100,
        Math.ceil(((props.submmited ?? 0) / props.n) * 100)
    );

    return (
        <div className={style.item}>
            <div className={style.icon__box}>
                <Count className={style.count}>{props.avaliable ?? 0}</Count>
                <img src={icon} alt="" className={style.icon} />
            </div>
            <div className={style.item__info}>
                <div className={style.item__name}>{props.name}</div>
                <div className={style.item__number}>
                    {props.submmited ?? 0} / {props.n}
                </div>
                <div
                    className={style.progress__bar}
                    style={
                        { "--percent": `${percent}%` } as React.CSSProperties
                    }
                ></div>
            </div>
        </div>
    );
}

export default GoalItem;

export interface GoalItemProps {
    name: string;
    n: number;
    submmited?: number;
    avaliable?: number;
}
