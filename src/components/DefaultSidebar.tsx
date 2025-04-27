import CraftingMenu from "./CraftingMenu/CraftingMenu";
import Inventory from "./Inventory/Inventory";
import TabContainer, { Tab } from "./TabView/TabContainer";
import InventoryIcon from "../assets/img/inventory.png";
import CraftingIcon from "../assets/img/Crafting.png";
import GoalIcon from "../assets/img/Goal.png";
import Goal from "./Goal/Goal";
import useInventory from "../hook/useInventory";

function DefaultSidebar() {
    const { inventory, deleteItem, popItem, craftItem } = useInventory();
    const tabs: Tab[] = [
        {
            key: "inventory",
            icon: InventoryIcon,
            tab: (
                <Inventory
                    inventory={{
                        inventory,
                        deleteItem,
                    }}
                />
            ),
        },
        {
            key: "craft",
            icon: CraftingIcon,
            tab: (
                <CraftingMenu
                    inventory={{
                        inventory,
                        popItem,
                        craftItem,
                    }}
                />
            ),
        },
        {
            key: "goal",
            icon: GoalIcon,
            tab: <Goal />,
        },
    ];
    return <TabContainer tabs={tabs} default="inventory" />;
}

export default DefaultSidebar;
