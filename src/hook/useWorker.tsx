import { useState } from "react";
import GameWorkerService from "../services/GameWorkerService";

export type WorkerModificationFunction = (amount?: number) => Promise<boolean>;

export type UseWorkerReturn = {
    worker: Coin;
    increaseWorker: WorkerModificationFunction;
    decreaseWorker: WorkerModificationFunction;
    increaseTotal: WorkerModificationFunction;
    updateWorker: () => void;
};

export default function useWorker(): UseWorkerReturn {
    const workerService = new GameWorkerService();

    const [worker, setWorker] = useState<Coin>(workerService.getWorker());

    async function increaseWorker(amount: number = 1) {
        const oldValue = worker.avaliable;

        setWorker((value) => {
            return {
                ...value,
                avaliable: Math.min(value.total, value.avaliable + amount),
            };
        });

        const status = await workerService.increaseWorker(amount);

        if (status) return true;

        setWorker((value) => {
            return {
                ...value,
                avaliable: oldValue,
            };
        });

        return false;
    }
    async function decreaseWorker(amount: number = 1) {
        const oldValue = worker.avaliable;

        setWorker((value) => {
            return {
                ...value,
                avaliable: Math.max(0, value.avaliable - amount),
            };
        });

        const status = await workerService.decreaseWorker(amount);

        if (status) return true;

        setWorker((value) => {
            return {
                ...value,
                avaliable: oldValue,
            };
        });

        return false;
    }

    async function increaseTotal(amount: number = 1) {
        const oldValue = amount;
        setWorker((value) => {
            return {
                ...value,
                total: value.total + amount,
            };
        });

        const status = await workerService.increaseTotalWorker(amount);

        if (status) return true;

        setWorker((value) => {
            return {
                ...value,
                total: oldValue,
            };
        });

        return false;
    }

    function updateWorker() {
        setWorker(workerService.getWorker());
    }

    return {
        worker,
        increaseWorker,
        decreaseWorker,
        increaseTotal,
        updateWorker,
    };
}

type CoinType = "Worker";

export interface Coin {
    OBJECTID: number;
    kind: CoinType;
    avaliable: number;
    total: number;
}
