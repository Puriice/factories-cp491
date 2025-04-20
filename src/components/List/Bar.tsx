import style from "./scss/index.module.scss";

function Bar(props: BarProps) {
    return (
        <div className={style.bar}>
            <div className={style.slider} style={{}}></div>
        </div>
    );
}

export default Bar;

export interface BarProps {
    value: number;
    max: number;
}
