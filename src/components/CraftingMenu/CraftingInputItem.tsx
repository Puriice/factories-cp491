import Count from "../Count";
import style from "./scss/CraftingMenu.module.scss";

function CraftingInputItem(props: CraftingInputItemProps) {
    return (
        <div className={style.input__box}>
            <Count className={style.input__quality}>
                {props.total}/{props.n}
            </Count>
            <img src={props.icon} alt="" className={style.input__icon} />
        </div>
    );
}

export default CraftingInputItem;
export interface CraftingInputItemProps {
    name: string;
    icon: string;
    n: number;
    total: number;
}
