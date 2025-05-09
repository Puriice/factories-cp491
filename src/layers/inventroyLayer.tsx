import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

const inventoryLayer = new FeatureLayer({
    url: "https://services6.arcgis.com/LeDo6T0TXe79jtvH/arcgis/rest/services/FactoryInventory/FeatureServer/0",
    layerId: 0,
    outFields: ["*"],
    geometryType: null,
    editingEnabled: true,
    apiKey: import.meta.env.VITE_API_KEY,
});

export default inventoryLayer;
