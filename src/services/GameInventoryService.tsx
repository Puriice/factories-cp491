import Graphic from "@arcgis/core/Graphic";
import { query } from "../hook/useInventory";
import inventoryLayer from "../layers/inventroyLayer";
import getUserId from "./getUserId";
import MissingTexture from "../assets/img/missingTexture.png";
import ItemImages from "../assets/ItemImages";
import gameConfig from "../../config/game.json";

export default class GameInventoryService {
    private static instance: GameInventoryService | null = null;
    private userId!: string;

    private loadingInventoryStatus!: Promise<boolean>;

    private items: Item[] = [];

    constructor() {
        if (GameInventoryService.instance) return GameInventoryService.instance;

        GameInventoryService.instance = this;

        this.userId = getUserId();

        this.loadingInventoryStatus = this.loadInventory();
    }

    private async loadInventory() {
        const outFields = ["OBJECTID", "name", "n", "icon"];

        this.items = await query<Item>(this.userId, inventoryLayer, outFields);

        return true;
    }

    public isReady() {
        return this.loadingInventoryStatus;
    }

    public getItems() {
        return this.items;
    }

    public async deleteItem(objectId: number) {
        const oldItems = [...this.items];

        this.items = this.items.filter((item) => item.OBJECTID != objectId);

        const result = await inventoryLayer.applyEdits({
            deleteFeatures: [
                new Graphic({
                    attributes: {
                        OBJECTID: objectId,
                    },
                }),
            ],
        });

        if (result.deleteFeatureResults[0].error == null) return true;

        console.error(result.deleteFeatureResults);

        this.items = oldItems;

        return false;
    }

    public getOptimisticAppendItem(items: Item[], name: string, n: number) {
        const _items = [
            ...items.map((item) => {
                return {
                    ...item,
                };
            }),
        ];

        const relatedItems = _items.filter((item) => item.name == name);

        const modifiedItems: Item[] = [];
        const appendedItems: Omit<Item, "OBJECTID">[] = [];
        const appendedObjectId: number[] = [];

        relatedItems.forEach((item) => {
            if (item.n == gameConfig.maxStack) return;
            if (n == 0) return;

            const diff = gameConfig.maxStack - item.n;

            modifiedItems.push(item);

            if (n <= diff) {
                console.log({
                    modify: item,
                    before: item.n,
                    after: item.n + n,
                    n,
                });

                item.n += n;
                n = 0;
            } else {
                item.n = gameConfig.maxStack;
                n -= diff;
            }
        });

        // remainder to append
        if (n > 0) {
            for (let i = n; i > 0; i -= 100) {
                const tempOBJECTIDArr = new Uint32Array(1);

                crypto.getRandomValues(tempOBJECTIDArr);

                const tempOBJECTID = Number(tempOBJECTIDArr);

                appendedObjectId.push(tempOBJECTID);

                if (i > gameConfig.maxStack) {
                    const payload = {
                        name,
                        n: gameConfig.maxStack,
                        icon: ItemImages[name] ?? MissingTexture,
                    };

                    _items.push({
                        ...payload,
                        OBJECTID: tempOBJECTID,
                    });

                    appendedItems.push(payload);

                    continue;
                }

                const payload = {
                    name,
                    n: i,
                    icon: ItemImages[name] ?? MissingTexture,
                };

                _items.push({
                    ...payload,
                    OBJECTID: tempOBJECTID,
                });

                appendedItems.push(payload);
            }
        }

        return {
            items: _items,
            modifiedItems,
            appendedItems,
            appendedObjectId,
        };
    }

    public async appendItem(name: string, n: number) {
        const oldItems = [...this.items];

        const { items, modifiedItems, appendedItems, appendedObjectId } =
            this.getOptimisticAppendItem(this.items, name, n);

        this.items = items;

        if (modifiedItems.length > 0) {
            const result = await inventoryLayer.applyEdits({
                updateFeatures: modifiedItems.map((item) => {
                    return new Graphic({
                        attributes: {
                            ...item,
                            owner: this.userId,
                        },
                    });
                }),
            });

            if (result.updateFeatureResults.some((res) => res.error != null)) {
                console.error(result.updateFeatureResults);

                this.items = oldItems;

                return false;
            }
        }

        if (appendedItems.length > 0) {
            const result = await inventoryLayer.applyEdits({
                addFeatures: appendedItems.map((item) => {
                    return new Graphic({
                        attributes: {
                            ...item,
                            owner: this.userId,
                        },
                    });
                }),
            });

            if (result.addFeatureResults.some((res) => res.error != null)) {
                console.error(result.addFeatureResults);

                this.items = oldItems;

                return false;
            }

            const appeneded = this.items.filter((item) =>
                appendedObjectId.includes(item.OBJECTID)
            );

            result.addFeatureResults.forEach((result, index) => {
                appeneded[index].OBJECTID = result.objectId!;
            });
        }

        return true;
    }
}

export interface Item {
    OBJECTID: number;
    name: string;
    n: number;
    icon: string;
}

const loadInventoryService = new Promise((res) => {
    const inventoryService = new GameInventoryService();

    inventoryService.isReady().then((value) => {
        if (value) res(inventoryService);
    });
});

export { loadInventoryService };
