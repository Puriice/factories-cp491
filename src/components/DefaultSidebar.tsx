import CraftingMenu from "./CraftingMenu/CraftingMenu";
import Inventory from "./Inventory/Inventory";
import TabContainer, { Tab } from "./TabView/TabContainer";
import InventoryIcon from "../assets/img/inventory.png";
import CraftingIcon from "../assets/img/Crafting.png";
import GoalIcon from "../assets/img/Goal.png";
import Goal from "./Goal/Goal";

function DefaultSidebar() {
    const tabs: Tab[] = [
        {
            key: "inventory",
            icon: InventoryIcon,
            tab: <Inventory />,
        },
        {
            key: "craft",
            icon: CraftingIcon,
            tab: <CraftingMenu />,
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
