import Graphic from "@arcgis/core/Graphic";
import { Coin, WorkerModificationFunction } from "../hook/useWorker";
import { query } from "../hook/useInventory";
import coinLayer from "../layers/coinLayer";
import getUserId from "./getUserId";

export default class GameWorkerService {
    private static instance: GameWorkerService | null = null;

    private OBJECTID = -999;
    private avaliableWorker = 1;
    private totalWorker = 1;

    private userId!: string;

    private isInitialized = false;

    private increaseWorkerFn: WorkerModificationFunction | null = null;
    private decreaseWorkerFn: WorkerModificationFunction | null = null;

    private increaseTotalWorkerFn: WorkerModificationFunction | null = null;

    constructor() {
        if (GameWorkerService.instance) return GameWorkerService.instance;

        GameWorkerService.instance = this;

        this.userId = getUserId();

        this.loadWorker().then(
            (() => {
                this.isInitialized = true;
            }).bind(this)
        );
    }

    private async loadWorker() {
        const outFields = ["OBJECTID", "kind", "avaliable", "total"];
        const coin = await query<Coin>(
            this.userId,
            coinLayer,
            outFields,
            `kind = 'Worker'`
        );

        if (coin.length == 0) {
            const result = await coinLayer.applyEdits({
                addFeatures: [
                    new Graphic({
                        attributes: {
                            kind: "Worker",
                            avaliable: 1,
                            total: 1,
                            owner: this.userId,
                        },
                    }),
                ],
            });

            console.debug(result.addFeatureResults);

            return this.loadWorker;
        }

        this.avaliableWorker = coin[0].avaliable;
        this.totalWorker = coin[0].total;
        this.OBJECTID = coin[0].OBJECTID;

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
    }

    public isReady() {
        return this.isInitialized;
    }

    public getOBJECTID() {
        return this.OBJECTID;
    }

    public getAvaliableWorker() {
        return this.avaliableWorker;
    }

    public getTotalWorker() {
        return this.totalWorker;
    }

    private createModificationFunction(
        modifyFunction: (amount: number) => Partial<Coin>
    ) {
        return async (amount: number = 1) => {
            const coin: Coin = {
                OBJECTID: this.OBJECTID,
                kind: "Worker",
                avaliable: this.avaliableWorker,
                total: this.totalWorker,
            };
            const userId = this.userId;

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

            return true;
        };
    }

    public increaseWorker(amount: number) {
        if (this.increaseWorkerFn == null)
            this.increaseWorkerFn = this.createModificationFunction(
                (amount) => {
                    return {
                        avaliable: Math.min(
                            this.totalWorker,
                            this.avaliableWorker + amount
                        ),
                    };
                }
            );

        return this.increaseWorkerFn(amount).then((value) => {
            if (!value) return value;

            this.avaliableWorker = Math.min(
                this.totalWorker,
                this.avaliableWorker + amount
            );

            return true;
        });
    }

    public decreaseWorker(amount: number) {
        if (this.decreaseWorkerFn == null)
            this.decreaseWorkerFn = this.createModificationFunction(
                (amount) => {
                    return {
                        avaliable: Math.max(0, this.avaliableWorker - amount),
                    };
                }
            );

        return this.decreaseWorkerFn(amount).then((value) => {
            if (!value) return value;

            this.avaliableWorker = Math.max(0, this.avaliableWorker - amount);

            return true;
        });
    }

    public increaseTotalWorker(amount: number) {
        if (this.increaseTotalWorkerFn == null)
            this.increaseTotalWorkerFn = this.createModificationFunction(
                (amount) => {
                    return {
                        total: this.totalWorker + amount,
                    };
                }
            );

        return this.increaseTotalWorkerFn(amount).then((value) => {
            if (!value) return value;

            this.totalWorker = this.totalWorker + amount;

            return true;
        });
    }
}
