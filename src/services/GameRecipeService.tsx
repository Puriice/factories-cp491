import ItemImages from "../assets/ItemImages";
import MissingTexture from "../assets/img/missingTexture.png";

export interface RecipeInputConstructor {
    name: string;
    n: number;
}

class RecipeInput {
    public readonly name: string;
    public readonly n: number;
    public readonly icon: string;

    constructor(options: RecipeInputConstructor) {
        this.name = options.name;
        this.n = options.n;
        this.icon = ItemImages[options.name] ?? MissingTexture;
    }
}

export interface RecipeConstructor {
    produce: string;
    n: number;
    clicks: number;
    inputs: RecipeInput[];
}

class Recipe {
    public readonly produce: string;
    public readonly n: number;
    public readonly clicks: number;
    public readonly inputs: RecipeInput[];
    public readonly icon: string;

    constructor(options: RecipeConstructor) {
        this.produce = options.produce;
        this.n = options.n;
        this.clicks = options.clicks;
        this.inputs = options.inputs;
        this.icon = ItemImages[options.produce] ?? MissingTexture;
    }
}

export default class GameRecipeService {
    private static instance: GameRecipeService | null = null;

    constructor() {
        if (GameRecipeService.instance) return GameRecipeService.instance;

        GameRecipeService.instance = this;
    }

    public getRecipes(): Recipe[] {
        return [
            new Recipe({
                produce: "Iron Bar",
                n: 1,
                clicks: 3,
                inputs: [
                    new RecipeInput({
                        name: "Iron",
                        n: 1,
                    }),
                ],
            }),
            new Recipe({
                produce: "Copper Bar",
                n: 1,
                clicks: 3,
                inputs: [
                    new RecipeInput({
                        name: "Copper",
                        n: 1,
                    }),
                ],
            }),
            new Recipe({
                produce: "Iron Plate",
                n: 2,
                clicks: 5,
                inputs: [
                    new RecipeInput({
                        name: "Iron Bar",
                        n: 1,
                    }),
                ],
            }),
            new Recipe({
                produce: "Iron Bolt",
                n: 6,
                clicks: 5,
                inputs: [
                    new RecipeInput({
                        name: "Iron Bar",
                        n: 1,
                    }),
                ],
            }),
            new Recipe({
                produce: "Wire",
                n: 40,
                clicks: 5,
                inputs: [
                    new RecipeInput({
                        name: "Copper Bar",
                        n: 8,
                    }),
                ],
            }),
            new Recipe({
                produce: "Cable",
                n: 20,
                clicks: 4,
                inputs: [
                    new RecipeInput({
                        name: "Wire",
                        n: 40,
                    }),
                ],
            }),
            new Recipe({
                produce: "Circuit Board",
                n: 2,
                clicks: 10,
                inputs: [
                    new RecipeInput({
                        name: "Wire",
                        n: 4,
                    }),
                    new RecipeInput({
                        name: "Iron Plate",
                        n: 2,
                    }),
                ],
            }),
            new Recipe({
                produce: "Calculator",
                n: 1,
                clicks: 10,
                inputs: [
                    new RecipeInput({
                        name: "Cable",
                        n: 2,
                    }),
                    new RecipeInput({
                        name: "Circuit Board",
                        n: 1,
                    }),
                    new RecipeInput({
                        name: "Iron Plate",
                        n: 4,
                    }),
                    new RecipeInput({
                        name: "Iron Bolt",
                        n: 8,
                    }),
                ],
            }),
        ];
    }
}

export { Recipe };
