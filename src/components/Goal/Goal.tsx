import { useMemo } from "react";
import gameConfig from "../../../config/game.json";
import useGoal from "../../hook/useGoal";
import { InventoryList, PopItem } from "../../hook/useInventory";
import style from "./scss/Goal.module.scss";
import Button from "../Button";
import GoalItem from "./GoalItem";

function Goal(props: GoalProps) {
    const { inventory } = props.inventory;
    const { phase, submmitedGoal } = useGoal();

    const { goals } = gameConfig;
    const targets = goals[phase.phase] ?? goals[0];

    const totalAvaliable = useMemo(() => {
        return inventory.reduce((prev, curr) => {
            if (!prev[curr.name]) {
                prev[curr.name] = curr.n;
                return prev;
            }

            prev[curr.name] += curr.n;

            return prev;
        }, {} as Record<string, number>);
    }, [inventory]);

    return (
        <div className={style.root}>
            <div className={style.goal__lists}>
                {targets.map((target) => {
                    return (
                        <GoalItem
                            name={target.name}
                            n={target.n}
                            avaliable={totalAvaliable[target.name]}
                            submmited={
                                submmitedGoal.find(
                                    (goal) => goal.name == target.name
                                )?.n
                            }
                        />
                    );
                })}
            </div>
            <Button className={style.submit__button}>Submit Item</Button>
        </div>
    );
}

export default Goal;

export interface GoalProps {
    inventory: {
        inventory: InventoryList;
        popItem: PopItem;
    };
}
