import Coal from "./img/resources/coal.png";
import Copper from "./img/resources/copper.png";
import Iron from "./img/resources/iron.png";
import Wood from "./img/resources/wood.png";
import IronBar from "./img/items/ironbar.png";
import CopperBar from "./img/items/copperbar.png";
import Wire from "./img/items/wire.png";
import Cable from "./img/items/cable.png";
import IronPlate from "./img/items/ironplate.png";
import IronBolt from "./img/items/ironbolt.png";
import CircuitBoard from "./img/items/circuitboard.png";
import Calculator from "./img/items/calculator.png";

const ItemImages: Record<string, string> = {
    Coal,
    Copper,
    Iron,
    Wood,
    "Iron Bar": IronBar,
    "Copper Bar": CopperBar,
    Wire,
    Cable,
    "Iron Plate": IronPlate,
    "Iron Bolt": IronBolt,
    "Circuit Board": CircuitBoard,
    Calculator,
};

export default ItemImages;
