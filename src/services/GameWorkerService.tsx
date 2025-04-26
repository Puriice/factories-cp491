import Graphic from "@arcgis/core/Graphic";
import { Coin, WorkerModificationFunction } from "../hook/useWorker";
import { query } from "../hook/useInventory";
import coinLayer from "../layers/coinLayer";
import getUserId from "./getUserId";
import workerAssignmentLayer from "../layers/workerAssignmentLayer";
import { WorkerAssignment } from "../hook/useWorkerAssignment";

export default class GameWorkerService {
    private static instance: GameWorkerService | null = null;

    private worker: Coin = {
        OBJECTID: -999,
        avaliable: 1,
        total: 1,
        kind: "Worker",
    };

    private workerAssignments: WorkerAssignment[] = [];

    private userId!: string;

    private workerLoadingStatus!: Promise<boolean>;
    private workerAssignmentLoadingStatus!: Promise<boolean>;

    private increaseWorkerFn: WorkerModificationFunction | null = null;
    private decreaseWorkerFn: WorkerModificationFunction | null = null;

    private increaseTotalWorkerFn: WorkerModificationFunction | null = null;

    constructor() {
        if (GameWorkerService.instance) return GameWorkerService.instance;

        GameWorkerService.instance = this;

        this.userId = getUserId();

        this.workerLoadingStatus = this.loadWorker();
        this.workerAssignmentLoadingStatus = this.loadWorkerAssignment();
    }

    private async loadWorker(): Promise<boolean> {
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

            return this.loadWorker();
        }

        this.worker = coin[0];

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

        return true;
    }

    private async loadWorkerAssignment(): Promise<boolean> {
        const outFields = ["OBJECTID", "targetId", "targetName", "assignDate"];
        const workers = await query<WorkerAssignment>(
            this.userId,
            workerAssignmentLayer,
            outFields
        );

        this.workerAssignments = workers;

        return true;
    }

    public isReady() {
        return [this.workerLoadingStatus, this.workerAssignmentLoadingStatus];
    }

    public getWorker() {
        return this.worker;
    }

    public getWorkerAssignement() {
        return this.workerAssignments;
    }

    public getOBJECTID() {
        return this.worker.OBJECTID;
    }

    public getAvaliableWorker() {
        return this.worker.avaliable;
    }

    public getTotalWorker() {
        return this.worker.total;
    }

    private createModificationFunction(
        modifyFunction: (amount: number) => Partial<Coin>
    ) {
        return async (amount: number = 1) => {
            const coin: Coin = {
                OBJECTID: this.worker.OBJECTID,
                kind: "Worker",
                avaliable: this.worker.avaliable,
                total: this.worker.total,
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

            if (result.updateFeatureResults[0].error == null) return true;

            console.error(result.updateFeatureResults);

            return false;
        };
    }

    public async increaseWorker(amount: number) {
        if (this.increaseWorkerFn == null)
            this.increaseWorkerFn = this.createModificationFunction(
                (amount) => {
                    return {
                        avaliable: Math.min(
                            this.worker.total,
                            this.worker.avaliable + amount
                        ),
                    };
                }
            );

        const oldValue = this.worker.avaliable;

        this.worker.avaliable = Math.min(
            this.worker.total,
            this.worker.avaliable + amount
        );

        const value = await this.increaseWorkerFn(amount);

        if (value) return true;

        this.worker.avaliable = oldValue;

        return false;
    }

    public async decreaseWorker(amount: number) {
        if (this.decreaseWorkerFn == null)
            this.decreaseWorkerFn = this.createModificationFunction(
                (amount) => {
                    return {
                        avaliable: Math.max(0, this.worker.avaliable - amount),
                    };
                }
            );

        const oldValue = this.worker.avaliable;

        this.worker.avaliable = Math.max(0, this.worker.avaliable - amount);

        const value = await this.decreaseWorkerFn(amount);

        if (value) return true;

        this.worker.avaliable = oldValue;

        return false;
    }

    public async increaseTotalWorker(amount: number) {
        if (this.increaseTotalWorkerFn == null)
            this.increaseTotalWorkerFn = this.createModificationFunction(
                (amount) => {
                    return {
                        total: this.worker.total + amount,
                    };
                }
            );

        const oldValue = this.worker.total;

        this.worker.total = this.worker.total + amount;

        const value = await this.increaseTotalWorkerFn(amount);

        if (value) return true;

        this.worker.total = oldValue;

        return false;
    }

    public async assignWorker(resourceId: number, resourceName: string) {
        const oldValue = [...this.workerAssignments];

        const payload = {
            targetId: resourceId,
            targetName: resourceName,
            assignDate: new Date(),
            owner: this.userId,
        };
        const tempOBJECTIDArr = new Uint32Array(1);

        crypto.getRandomValues(tempOBJECTIDArr);

        const tempOBJECTID = Number(tempOBJECTIDArr);

        this.workerAssignments.push({
            ...payload,
            OBJECTID: tempOBJECTID,
        });

        this.decreaseWorker(1);

        const assignWorkerResult = await workerAssignmentLayer.applyEdits({
            addFeatures: [
                new Graphic({
                    attributes: payload,
                }),
            ],
        });

        if (assignWorkerResult.addFeatureResults[0].error == null) {
            const index = this.workerAssignments.findIndex(
                (assignment) => assignment.OBJECTID == tempOBJECTID
            );

            if (index == -1) {
                console.log(this.workerAssignments);
                return true;
            }

            this.workerAssignments[index].OBJECTID =
                assignWorkerResult.addFeatureResults[0].objectId!;

            return true;
        }

        console.error(assignWorkerResult.addFeatureResults);

        this.increaseWorker(1);

        this.workerAssignments = oldValue;

        return false;
    }

    public async unassignWorker(resourceId: number, resourceName: string) {
        const targetWorkAssignment = this.workerAssignments.find(
            (assignment) =>
                assignment.targetId === resourceId &&
                assignment.targetName === resourceName
        );

        if (!targetWorkAssignment) return false;

        const oldValue = [...this.workerAssignments];

        this.increaseWorker(1);

        this.workerAssignments = this.workerAssignments.filter(
            (assignment) => assignment.OBJECTID != targetWorkAssignment.OBJECTID
        );

        const unassignWorkerResult = await workerAssignmentLayer.applyEdits({
            deleteFeatures: [
                new Graphic({
                    attributes: {
                        OBJECTID: targetWorkAssignment?.OBJECTID,
                    },
                }),
            ],
        });

        if (unassignWorkerResult.deleteFeatureResults[0].error == null)
            return true;

        console.log(unassignWorkerResult.deleteFeatureResults);

        this.decreaseWorker(1);

        this.workerAssignments = oldValue;

        return false;
    }
}

const loadWorkerService = new Promise((res) => {
    const workerService = new GameWorkerService();

    Promise.all(workerService.isReady()).then((value) => {
        if (value.every((value) => value)) res(workerService);
    });
});

export { loadWorkerService };
