import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

const coinLayer = new FeatureLayer({
    url: "https://services6.arcgis.com/LeDo6T0TXe79jtvH/arcgis/rest/services/FactoryInventory/FeatureServer/1",
    outFields: ["*"],
});

export default coinLayer;
