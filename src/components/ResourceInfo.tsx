import { PropsWithChildren } from "react";
import { Purities, ResourceName } from "../types/resources";
import style from "./scss/ResourceInfo.module.scss";
import ItemImages from "../assets/ItemImages";
import gameConfig from "../../config/game.json";
import Button from "./Button";
import useWorkerAssignment from "../hook/useWorkerAssignment";
import useWorker from "../hook/useWorker";

function ResourceInfo(props: PropsWithChildren<ResourceInfoProps>) {
    const { worker } = useWorker();
    const { occupiedWorker, assignWorker, unassignWorker, isReserved } =
        useWorkerAssignment();
    const { info } = props;

    const isReserve = isReserved(occupiedWorker, info.OBJECTID, info.name);

    console.log({ isReserve });

    return (
        <div className={style.root}>
            <div className={style.center}>
                <h1 className={style.title}>{info.name}</h1>
                <div className={style.name__box}>
                    <img
                        className={style.icon}
                        src={ItemImages[info.resource]}
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
                <div className={style.button__list}>
                    <Button
                        className={style.button}
                        disabled={worker.avaliable <= 0 || isReserve}
                        onClick={() => assignWorker(info.OBJECTID, info.name)}
                    >
                        Assign Worker ({worker.avaliable} / {worker.total})
                    </Button>
                    {isReserve ? (
                        <>
                            <Button
                                className={style.button}
                                onClick={() =>
                                    unassignWorker(info.OBJECTID, info.name)
                                }
                            >
                                Unassign Worker
                            </Button>
                            <Button className={style.button}>
                                Collect Resource
                            </Button>
                        </>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ResourceInfo;

export interface ResourceDetail {
    OBJECTID: number;
    name: string;
    resource: ResourceName;
    purity: Purities;
}

export interface ResourceInfoProps {
    info: ResourceDetail;
}
