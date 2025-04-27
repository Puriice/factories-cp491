import style from "./scss/ProgressBar.module.scss";

function ProgressBar(props: ProgressBarProps) {
    const percent = Math.floor((props.value / props.max) * 100);

    return (
        <div className={`${style.root} ${style.className}`}>
            <div
                className={style.bar}
                style={{ "--percent": `${percent}%` } as React.CSSProperties}
            ></div>
        </div>
    );
}

export default ProgressBar;

export interface ProgressBarProps {
    value: number;
    max: number;
    className?: string;
}
