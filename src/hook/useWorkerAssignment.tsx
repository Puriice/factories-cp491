import Graphic from "@arcgis/core/Graphic";
import workerAssignmentLayer from "../layers/workerAssignmentLayer";
import useWorker from "./useWorker";
import { useEffect, useMemo, useState } from "react";
import { query } from "./useInventory";
import useUserId from "./useUserId";

export type AssignWorkerFunction = (
    resourceId: number,
    resourceName: string
) => Promise<boolean>;

export type UnassignWorkerFunction = (
    resourceId: number,
    resourceName: string
) => Promise<boolean>;

export type CheckReservedWorker = (
    occupiedWorkers: WorkerAssignment[],
    resourceId: number,
    resourceName: string
) => boolean;

export interface AssignmentWorkerFunctions {
    occupiedWorker: WorkerAssignment[];
    assignWorker: AssignWorkerFunction;
    unassignWorker: UnassignWorkerFunction;
    isReserved: CheckReservedWorker;
}

export default function useWorkerAssignment(): AssignmentWorkerFunctions {
    const userId = useUserId();
    const [, { increaseWorker, decreaseWorker }] = useWorker();
    const [occupiedWorker, setAssignedWorker] = useState<WorkerAssignment[]>(
        []
    );
    const outFields = useMemo(
        () => ["OBJECTID", "targetId", "targetName", "assignDate"],
        []
    );

    useEffect(() => {
        let isMounted = true;

        const loadWorker = async () => {
            const workers = await query<WorkerAssignment>(
                userId,
                workerAssignmentLayer,
                outFields
            );

            console.log(workers);

            if (isMounted) {
                setAssignedWorker(workers);
            }
        };

        loadWorker();

        return () => {
            isMounted = false;
        };
    }, [userId, outFields]);

    async function assignWorker(resourceId: number, resourceName: string) {
        console.log({ resourceId, resourceName });

        decreaseWorker(1);

        const assignWorkerResult = await workerAssignmentLayer.applyEdits({
            addFeatures: [
                new Graphic({
                    attributes: {
                        targetId: resourceId,
                        targetName: resourceName,
                        assignDate: new Date(),
                        owner: userId,
                    },
                }),
            ],
        });

        if (
            assignWorkerResult.addFeatureResults.some(
                (result) => result.error != null
            )
        ) {
            increaseWorker(1);

            console.log(assignWorkerResult.addFeatureResults);

            return false;
        }

        setAssignedWorker((value) => {
            return [
                ...value,
                {
                    OBJECTID: assignWorkerResult.addFeatureResults[0].objectId!,
                    targetId: resourceId,
                    targetName: resourceName,
                    assignDate: new Date(),
                },
            ];
        });

        return true;
    }

    async function unassignWorker(resourceId: number, resourceName: string) {
        const targetWorkAssignment = occupiedWorker.find(
            (assignment) =>
                assignment.targetId === resourceId &&
                assignment.targetName === resourceName
        );

        if (!targetWorkAssignment) return false;

        increaseWorker(1);

        const unassignWorkerResult = await workerAssignmentLayer.applyEdits({
            deleteFeatures: [
                new Graphic({
                    attributes: {
                        OBJECTID: targetWorkAssignment?.OBJECTID,
                    },
                }),
            ],
        });

        if (
            unassignWorkerResult.deleteFeatureResults.some(
                (result) => result.error !== null
            )
        ) {
            await decreaseWorker(1);

            console.log(unassignWorkerResult.deleteFeatureResults);

            return false;
        }

        setAssignedWorker((value) => {
            return value.filter(
                (val) => val.OBJECTID != targetWorkAssignment.OBJECTID
            );
        });

        return true;
    }

    function isReserved(
        occupiedWorkers: WorkerAssignment[],
        resourceId: number,
        resourceName: string
    ) {
        const target =
            occupiedWorkers.findIndex(
                (assignment) =>
                    assignment.targetId === resourceId &&
                    assignment.targetName === resourceName
            ) != -1;

        return target;
    }

    return {
        occupiedWorker,
        assignWorker,
        unassignWorker,
        isReserved,
    };
}

export interface WorkerAssignment {
    OBJECTID: number;
    targetId: number;
    targetName: string;
    assignDate: Date;
}
