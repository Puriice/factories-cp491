import { useEffect, useMemo, useState } from "react";
import useUserId from "./useUserId";
import { query } from "./useInventory";
import coinLayer from "../layers/coinLayer";
import Graphic from "@arcgis/core/Graphic";

// let coinsItem: Coin | null = null;
export type CoinModificationFunction = (amount?: number) => Promise<boolean>;

export interface CoinAvaliableModificationFunction {
    increaseCoin: CoinModificationFunction;
    decreaseCoin: CoinModificationFunction;
}

export interface CoinTotalModificationFunction {
    increaseTotal: CoinModificationFunction;
    decreaseTotal: CoinModificationFunction;
}

export type UseCoinReturn = [
    Coin,
    CoinAvaliableModificationFunction,
    CoinTotalModificationFunction
];

export default function useCoin(kind: CoinType = "Worker"): UseCoinReturn {
    const userId = useUserId();

    const outFields = useMemo(
        () => ["OBJECTID", "kind", "avaliable", "total"],
        []
    );

    const [coin, setCoin] = useState<Coin>({
        OBJECTID: -1,
        kind,
        avaliable: 1,
        total: 1,
    });

    useEffect(() => {
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

                return await loadCoin();
            }

            if (isMounted) {
                setCoin(coin[0]);
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
            const targetCoin = modifyFunction(amount);
            const result = await coinLayer.applyEdits({
                updateFeatures: [
                    new Graphic({
                        attributes: {
                            ...coin,
                            ...targetCoin,
                            owner: userId,
                        },
                    }),
                ],
            });

            if (result.updateFeatureResults.some((r) => r.error === null)) {
                console.error(result.updateFeatureResults);

                return false;
            }

            setCoin({
                ...coin,
                ...targetCoin,
            });

            return true;
        };
    }

    const increaseCoin = createModificationCoin((amount) => {
        return {
            avaliable: Math.min(coin.total, coin.avaliable + amount),
        };
    });

    const decreaseCoin = createModificationCoin((amount) => {
        return {
            avaliable: Math.max(0, coin.avaliable - amount),
        };
    });

    const increaseTotal = createModificationCoin((amount) => {
        return {
            total: coin.total + amount,
        };
    });

    const decreaseTotal = createModificationCoin((amount) => {
        const targetTotal = Math.max(1, coin.total - amount);
        return {
            total: targetTotal,
            avaliable: Math.min(coin.avaliable, targetTotal),
        };
    });

    return [
        coin,
        { increaseCoin, decreaseCoin },
        { increaseTotal, decreaseTotal },
    ];
}

type CoinType = "Worker";

export interface Coin {
    OBJECTID: number;
    kind: CoinType;
    avaliable: number;
    total: number;
}
