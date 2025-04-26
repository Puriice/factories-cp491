import style from "./scss/Carousel.module.scss";

function CarouselItem(props: React.PropsWithChildren) {
    return <div className={style.item}>{props.children}</div>;
}

export default CarouselItem;
