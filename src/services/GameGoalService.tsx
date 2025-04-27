import Graphic from "@arcgis/core/Graphic";
import { query } from "../hook/useInventory";
import goalPhaseLayer from "../layers/goalPhaseLayer";
import getUserId from "./getUserId";
import goalSubmissionLayer from "../layers/goalSubmissionLayer";

export default class GameGoalService {
    private static instance: GameGoalService | null = null;

    private loadingPhaseStatus!: Promise<boolean>;
    private loadingSubmittedGoalStatus!: Promise<boolean>;

    private userId!: string;
    private phase: Phase = {
        OBJECTID: -999,
        phase: 0,
    };

    private submittedGoals: Goal[] = [];

    constructor() {
        if (GameGoalService.instance) return GameGoalService.instance;

        GameGoalService.instance = this;

        this.userId = getUserId();

        this.loadingPhaseStatus = this.loadPhase();
        this.loadingSubmittedGoalStatus = this.loadSubmmittedGoal();
    }

    async loadPhase(): Promise<boolean> {
        const outFields = ["OBJECTID", "phase"];
        const phase = await query<Phase>(
            this.userId,
            goalPhaseLayer,
            outFields
        );

        if (phase.length == 0) {
            const result = await goalPhaseLayer.applyEdits({
                addFeatures: [
                    new Graphic({
                        attributes: {
                            phase: 0,
                            owner: this.userId,
                        },
                    }),
                ],
            });

            console.debug(result.addFeatureResults);

            return this.loadPhase();
        }

        this.phase = phase[0];

        if (phase.length > 1) {
            await goalPhaseLayer.applyEdits({
                deleteFeatures: phase.slice(1).map((p) => {
                    return new Graphic({
                        attributes: {
                            OBJECTID: p.OBJECTID,
                        },
                    });
                }),
            });
        }

        return true;
    }

    async loadSubmmittedGoal(): Promise<boolean> {
        const outFields = ["OBJECTID", "name", "n"];

        this.submittedGoals = await query<Goal>(
            this.userId,
            goalSubmissionLayer,
            outFields
        );

        return true;
    }

    public isReady() {
        return [this.loadingPhaseStatus, this.loadingSubmittedGoalStatus];
    }

    public getPhase() {
        return this.phase;
    }

    public getSubmitedGoal() {
        return this.submittedGoals;
    }
}

export interface Phase {
    OBJECTID: number;
    phase: number;
}

export interface Goal {
    OBJECTID: number;
    name: string;
    n: number;
}

const loadGoalService = new Promise((res) => {
    const goalService = new GameGoalService();

    Promise.all(goalService.isReady()).then((value) => {
        if (value.every((value) => value)) res(goalService);
    });
});

export { loadGoalService };
