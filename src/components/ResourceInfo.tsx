import { PropsWithChildren, useEffect, useState } from "react";
import { Purities, ResourceName } from "../types/resources";
import style from "./scss/ResourceInfo.module.scss";
import ItemImages from "../assets/ItemImages";
import gameConfig from "../../config/game.json";
import Button from "./Button";
import useWorkerAssignment from "../hook/useWorkerAssignment";
import useWorker from "../hook/useWorker";
import useInventory from "../hook/useInventory";

function ResourceInfo(props: PropsWithChildren<ResourceInfoProps>) {
    const { appendItem } = useInventory();
    const { worker } = useWorker();
    const {
        occupiedWorker,
        assignWorker,
        reassignWorker,
        unassignWorker,
        isReserved,
    } = useWorkerAssignment();
    const { info } = props;

    const isReserve = isReserved(occupiedWorker, info.OBJECTID, info.name);

    function calculateCollectedResource(
        startTimestamp: number,
        resourcePerMinute: number
    ) {
        const currentTimestamp = Date.now();
        const elapsedMilliseconds = currentTimestamp - startTimestamp;
        const elapsedMinutes = elapsedMilliseconds / 60000;
        const resourcesGenerated = elapsedMinutes * resourcePerMinute;

        return Math.min(
            Math.floor(resourcesGenerated),
            gameConfig.maximumNodeProduces
        );
    }

    const [nResource, setNResource] = useState(0);

    useEffect(() => {
        if (!isReserve) return;

        const resourceloop = setInterval(() => {
            setNResource(
                calculateCollectedResource(
                    isReserve.assignDate,
                    gameConfig.purities[info.purity]
                )
            );
        }, 1 / (gameConfig.purities[info.purity] ?? 30));

        return () => {
            clearInterval(resourceloop);
        };
    }, [info.purity, isReserve]);

    return (
        <div className={style.root}>
            <div className={style.center}>
                <h1 className={style.title}>{info.name}</h1>
                <div className={style.name__box}>
                    {nResource > 0 ? (
                        <div className={style.count}>{nResource}</div>
                    ) : (
                        <></>
                    )}

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
                        disabled={worker.avaliable <= 0 || !!isReserve}
                        onClick={() => assignWorker(info.OBJECTID, info.name)}
                    >
                        Assign Worker ({worker.avaliable} / {worker.total})
                    </Button>
                    {isReserve ? (
                        <>
                            <Button
                                className={style.button}
                                onClick={() => {
                                    appendItem(info.resource, nResource);
                                    setNResource(0);
                                    unassignWorker(info.OBJECTID, info.name);
                                }}
                            >
                                Unassign Worker
                            </Button>
                            <Button
                                className={style.button}
                                onClick={() => {
                                    appendItem(info.resource, nResource);
                                    setNResource(0);
                                    reassignWorker(isReserve.OBJECTID);
                                }}
                            >
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
