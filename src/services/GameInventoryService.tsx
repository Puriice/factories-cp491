import Graphic from "@arcgis/core/Graphic";
import { query } from "../hook/useInventory";
import inventoryLayer from "../layers/inventroyLayer";
import getUserId from "./getUserId";
import MissingTexture from "../assets/img/missingTexture.png";
import ItemImages from "../assets/ItemImages";

export default class GameInventoryService {
    private static instance: GameInventoryService | null = null;
    private userId!: string;

    private loadingInventoryStatus!: Promise<boolean>;

    private items: InventoryItem[] = [];

    constructor() {
        if (GameInventoryService.instance) return GameInventoryService.instance;

        GameInventoryService.instance = this;

        this.userId = getUserId();

        this.loadingInventoryStatus = this.loadInventory();
    }

    private async loadInventory() {
        const outFields = ["OBJECTID", "name", "n", "icon"];

        this.items = await query<InventoryItem>(
            this.userId,
            inventoryLayer,
            outFields
        );

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

        this.items = oldItems;

        return false;
    }

    public async appendItem(name: string, n: number) {
        const oldItems = [...this.items];

        const tempOBJECTIDArr = new Uint32Array(1);

        crypto.getRandomValues(tempOBJECTIDArr);

        const tempOBJECTID = Number(tempOBJECTIDArr);
        const payload: Omit<InventoryItem, "OBJECTID"> = {
            name,
            n,
            icon: ItemImages[name] ?? MissingTexture,
        };

        this.items.push({
            ...payload,
            OBJECTID: tempOBJECTID,
        });

        const result = await inventoryLayer.applyEdits({
            addFeatures: [
                new Graphic({
                    attributes: {
                        ...payload,
                        owner: this.userId,
                    },
                }),
            ],
        });

        if (result.addFeatureResults[0].error == null) {
            const itemIndex = this.items.findIndex(
                (item) => item.OBJECTID == tempOBJECTID
            );

            if (itemIndex == -1) return true;

            this.items[itemIndex].OBJECTID =
                result.addFeatureResults[0].objectId!;

            return true;
        }

        console.error(result.addFeatureResults);

        this.items = oldItems;

        return false;
    }
}

export interface InventoryItem {
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
