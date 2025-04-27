import { useEffect, useMemo, useState } from "react";
import GameRecipeService from "../../services/GameRecipeService";
import Button from "../Button";
import ProgressBar from "../Progress/ProgressBar";
import CraftingListItem from "./CraftingListItem";
import style from "./scss/CraftingMenu.module.scss";
import CraftingInputItem from "./CraftingInputItem";
import useInventory from "../../hook/useInventory";

function CraftingMenu() {
    const recipeService = new GameRecipeService();
    const recipes = recipeService.getRecipes();

    const [selectedRecipe, setSelectedRecipe] = useState(recipes[0]);
    const [clickedCount, setClickedCount] = useState(0);
    const [isMouseDown, setIsMouseDown] = useState(false);

    const { inventory } = useInventory();

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

    useEffect(() => {
        if (!isMouseDown) return;

        const clickInterval = setInterval(() => {
            setClickedCount((count) => {
                return ++count % (selectedRecipe.clicks + 1);
            });
        }, 250);

        return () => {
            clearInterval(clickInterval);
        };
    }, [isMouseDown, selectedRecipe.clicks]);

    return (
        <div className={style.root}>
            <div className={style.recipe__list}>
                {recipes.map((recipe) => {
                    return (
                        <CraftingListItem
                            name={recipe.produce}
                            icon={recipe.icon}
                            onClick={() => {
                                setClickedCount(0);
                                setSelectedRecipe(recipe);
                            }}
                        />
                    );
                })}
            </div>
            <div className={style.recipe__window}>
                <div className={style.recipe__info}>
                    <h1 className={style.recipe__name}>
                        {selectedRecipe.produce}
                    </h1>
                    <img
                        src={selectedRecipe.icon}
                        alt=""
                        className={style.recipe__icon}
                    />
                    <div className={style.input__list}>
                        {selectedRecipe.inputs.map((input) => {
                            return (
                                <CraftingInputItem
                                    name={input.name}
                                    icon={input.icon}
                                    n={input.n}
                                    total={totalAvaliable[input.name] ?? 0}
                                />
                            );
                        })}
                    </div>
                </div>
                <ProgressBar value={clickedCount} max={selectedRecipe.clicks} />
                <Button
                    className={style.craft__button}
                    onMouseDown={() => setIsMouseDown(true)}
                    onMouseUp={() => setIsMouseDown(false)}
                >
                    Craft
                </Button>
            </div>
        </div>
    );
}

export default CraftingMenu;
