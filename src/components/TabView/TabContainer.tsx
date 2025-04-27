import { ReactElement, useMemo, useState } from "react";
import style from "./scss/TabView.module.scss";
import Carousel from "../Carousel/Carousel";
import CarouselItem from "../Carousel/CarouselItem";
import TabButton from "./TabButton";

function TabContainer(props: TabContainerProps) {
    const travelsalIndex = useMemo(() => {
        const toReturn: Record<string, number> = {};

        props.tabs.forEach((tab, index) => {
            toReturn[tab.key] = index;
        });

        return toReturn;
    }, [props.tabs]);

    const defaultTabIndex = travelsalIndex[props.default];

    const [index, setIndex] = useState(defaultTabIndex ?? 0);

    return (
        <div className={style.root}>
            <Carousel index={index}>
                {props.tabs.map((tab) => {
                    return <CarouselItem key={tab.key}>{tab.tab}</CarouselItem>;
                })}
            </Carousel>
            <div className={style.button__list}>
                {props.tabs.map((tab, i) => {
                    return (
                        <TabButton
                            key={tab.key}
                            button={tab}
                            onClick={() => {
                                setIndex(travelsalIndex[tab.key]);
                            }}
                            className={index == i ? style.active : ""}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default TabContainer;

export interface Tab {
    key: string;
    icon: string;
    tab: ReactElement;
}
export interface TabContainerProps {
    tabs: Tab[];
    default: string;
}
