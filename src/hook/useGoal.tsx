import { useState } from "react";
import GameGoalService, { Goal, Phase } from "../services/GameGoalService";

export type useGoalReturns = {
    phase: Phase;
    submmitedGoal: Goal[];
};

export default function useGoal() {
    const goalService = new GameGoalService();

    const [phase] = useState(goalService.getPhase());
    const [submmitedGoal] = useState(goalService.getSubmitedGoal());

    return { phase, submmitedGoal };
}
