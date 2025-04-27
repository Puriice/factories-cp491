import Coal from "./img/resources/coal.png";
import Copper from "./img/resources/copper.png";
import Iron from "./img/resources/iron.png";
import Wood from "./img/resources/wood.png";
import IronBar from "./img/items/ironbar.png";
import CopperBar from "./img/items/copperbar.png";

const ItemImages: Record<string, string> = {
    Coal,
    Copper,
    Iron,
    Wood,
    "Iron Bar": IronBar,
    "Copper Bar": CopperBar,
};

export default ItemImages;
