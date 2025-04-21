import { PropsWithChildren } from "react";
import { Purities, ResourceName } from "../types/resources";
import style from "./scss/ResourceInfo.module.scss";
import ResourceNodeImg from "../assets/ResourceNodeImg";
import gameConfig from "../../config/game.json";
import Button from "./Button";

function ResourceInfo(props: PropsWithChildren<ResourceInfoProps>) {
    const { info } = props;
    return (
        <div className={style.root}>
            <div className={style.center}>
                <h1 className={style.title}>{info.name}</h1>
                <div className={style.name__box}>
                    <img
                        className={style.icon}
                        src={ResourceNodeImg[info.resource]}
                        alt={`${info.resource} icon`}
                    />
                    <div className={style.name}>{info.resource}</div>
                </div>
                <div className={style.detail__box}>
                    <div className={style.purity}>{info.purity}</div>
                    <div className={style.detail__name}>Purity</div>
                </div>
                <div className={style.detail__box}>
                    <div className={style.product__rate}>
                        {gameConfig.purities[info.purity]}
                    </div>
                    <div className={style.detail__name}>Resource/Minute</div>
                </div>
                <Button className={style.button} disabled>
                    Assign People
                </Button>
            </div>
        </div>
    );
}

export default ResourceInfo;

export interface ResourceDetail {
    name: string;
    resource: ResourceName;
    purity: Purities;
}

export interface ResourceInfoProps {
    info: ResourceDetail;
}
