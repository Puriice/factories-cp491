import Search from "@arcgis/core/widgets/Search";
import LayerSearchSource from "@arcgis/core/widgets/Search/LayerSearchSource";
import resourceNodesLayer from "../layers/resourceNodes";

const searchWidget = new Search({
    sources: [
        new LayerSearchSource({
            layer: resourceNodesLayer,
            searchFields: ["name", "resource", "purity"],
            displayField: "name",
            exactMatch: false,
            outFields: ["name", "resource", "purity"],
            name: "Resources Node",
            suggestionTemplate: "{name} - {resource} - {purity}",
        }),
    ],
});

export default searchWidget;
