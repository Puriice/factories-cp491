import { useEffect, useMemo, useState } from "react";
import useUserId from "./useUserId";
import { query } from "./useInventory";
import coinLayer from "../layers/coinLayer";
import Graphic from "@arcgis/core/Graphic";

export type WorkerModificationFunction = (amount?: number) => Promise<boolean>;

export interface WorkerAvaliableModificationFunction {
    increaseWorker: WorkerModificationFunction;
    decreaseWorker: WorkerModificationFunction;
}

export interface WorkerTotalModificationFunction {
    increaseTotal: WorkerModificationFunction;
}

export type UseWorkerReturn = [
    Coin,
    WorkerAvaliableModificationFunction,
    WorkerTotalModificationFunction
];

const workerCache: Coin | null = null;

export default function useWorker(): UseWorkerReturn {
    const kind = "Worker";
    const userId = useUserId();

    const outFields = useMemo(
        () => ["OBJECTID", "kind", "avaliable", "total"],
        []
    );

    const [worker, setWorker] = useState<Coin>({
        OBJECTID: -999,
        kind,
        avaliable: 0,
        total: 0,
    });

    useEffect(() => {
        if (workerCache) {
            setWorker(workerCache);
            return;
        }

        let isMounted = true;

        const loadCoin = async () => {
            const coin = await query<Coin>(
                userId,
                coinLayer,
                outFields,
                `kind = '${kind}'`
            );

            if (coin.length == 0) {
                const result = await coinLayer.applyEdits({
                    addFeatures: [
                        new Graphic({
                            attributes: {
                                kind,
                                avaliable: 1,
                                total: 1,
                                owner: userId,
                            },
                        }),
                    ],
                });

                console.debug(result.addFeatureResults);

                return loadCoin();
            }

            if (isMounted) {
                setWorker(coin[0]);
            }
            if (coin.length > 1) {
                await coinLayer.applyEdits({
                    deleteFeatures: coin.slice(1).map((coin) => {
                        return new Graphic({
                            attributes: {
                                OBJECTID: coin.OBJECTID,
                            },
                        });
                    }),
                });
            }
        };

        loadCoin();

        return () => {
            isMounted = false;
        };
    }, [userId, outFields, kind]);

    function createModificationCoin(
        modifyFunction: (amount: number) => Partial<Coin>
    ) {
        return async function (amount: number = 1) {
            const targetWorker = modifyFunction(amount);
            const result = await coinLayer.applyEdits({
                updateFeatures: [
                    new Graphic({
                        attributes: {
                            ...worker,
                            ...targetWorker,
                            owner: userId,
                        },
                    }),
                ],
            });

            if (result.updateFeatureResults.some((r) => r.error !== null)) {
                console.error(result.updateFeatureResults);

                return false;
            }

            setWorker({
                ...worker,
                ...targetWorker,
            });

            return true;
        };
    }

    const increaseWorker = createModificationCoin((amount) => {
        return {
            avaliable: Math.min(worker.total, worker.avaliable + amount),
        };
    });

    const decreaseWorker = createModificationCoin((amount) => {
        return {
            avaliable: Math.max(0, worker.avaliable - amount),
        };
    });

    const increaseTotal = createModificationCoin((amount) => {
        return {
            total: worker.total + amount,
        };
    });

    return [worker, { increaseWorker, decreaseWorker }, { increaseTotal }];
}

type CoinType = "Worker";

export interface Coin {
    OBJECTID: number;
    kind: CoinType;
    avaliable: number;
    total: number;
}
