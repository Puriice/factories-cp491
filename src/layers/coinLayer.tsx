import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import config from "../../config/arcgis.json";

const coinLayer = new FeatureLayer({
    url: "https://services6.arcgis.com/LeDo6T0TXe79jtvH/arcgis/rest/services/FactoryInventory/FeatureServer/1",
    layerId: 1,
    outFields: ["*"],
    geometryType: null,
    editingEnabled: true,
    apiKey: config.apiKey,
});

export default coinLayer;
