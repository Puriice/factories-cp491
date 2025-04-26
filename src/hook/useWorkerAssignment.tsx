import { useState } from "react";
import useUserId from "./useUserId";
import GameWorkerService from "../services/GameWorkerService";

export type AssignWorkerFunction = (
    resourceId: number,
    resourceName: string
) => Promise<boolean>;

export type ReassignWorkerFunction = (objectId: number) => Promise<boolean>;

export type UnassignWorkerFunction = (
    resourceId: number,
    resourceName: string
) => Promise<boolean>;

export type CheckReservedWorker = (
    occupiedWorkers: WorkerAssignment[],
    resourceId: number,
    resourceName: string
) => WorkerAssignment | undefined;

export interface AssignmentWorkerFunctions {
    occupiedWorker: WorkerAssignment[];
    assignWorker: AssignWorkerFunction;
    reassignWorker: ReassignWorkerFunction;
    unassignWorker: UnassignWorkerFunction;
    isReserved: CheckReservedWorker;
}

export default function useWorkerAssignment(): AssignmentWorkerFunctions {
    const workerService = new GameWorkerService();

    const userId = useUserId();
    // const { increaseWorker, decreaseWorker } = useWorker();
    const [occupiedWorker, setAssignedWorker] = useState<WorkerAssignment[]>(
        workerService.getWorkerAssignement()
    );

    async function assignWorker(resourceId: number, resourceName: string) {
        const payload = {
            targetId: resourceId,
            targetName: resourceName,
            assignDate: new Date().getTime(),
            owner: userId,
        };
        const tempOBJECTIDArr = new Uint32Array(1);

        crypto.getRandomValues(tempOBJECTIDArr);

        const tempOBJECTID = Number(tempOBJECTIDArr);

        setAssignedWorker((value) => {
            return [
                ...value,
                {
                    ...payload,
                    OBJECTID: tempOBJECTID,
                },
            ];
        });

        const status = await workerService.assignWorker(
            resourceId,
            resourceName
        );

        setAssignedWorker(workerService.getWorkerAssignement());

        return status;
    }

    async function reassignWorker(objectId: number) {
        setAssignedWorker((value) => {
            return value.map((assignment) => {
                if (assignment.OBJECTID != objectId) return assignment;

                return {
                    ...assignment,
                    assignDate: Date.now(),
                };
            });
        });

        const status = await workerService.reassignWorker(objectId);

        setAssignedWorker(workerService.getWorkerAssignement());

        return status;
    }

    async function unassignWorker(resourceId: number, resourceName: string) {
        setAssignedWorker((value) => {
            return value.filter(
                (assignment) =>
                    assignment.targetId != resourceId &&
                    assignment.targetName != resourceName
            );
        });

        const status = await workerService.unassignWorker(
            resourceId,
            resourceName
        );

        setAssignedWorker(workerService.getWorkerAssignement());

        return status;
    }

    function isReserved(
        occupiedWorkers: WorkerAssignment[],
        resourceId: number,
        resourceName: string
    ) {
        const target = occupiedWorkers.find(
            (assignment) =>
                assignment.targetId === resourceId &&
                assignment.targetName === resourceName
        );

        return target;
    }

    return {
        occupiedWorker,
        assignWorker,
        reassignWorker,
        unassignWorker,
        isReserved,
    };
}

export interface WorkerAssignment {
    OBJECTID: number;
    targetId: number;
    targetName: string;
    assignDate: number;
}
