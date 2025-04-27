import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

const goalPhaseLayer = new FeatureLayer({
    url: "https://services6.arcgis.com/LeDo6T0TXe79jtvH/arcgis/rest/services/FactoryGoal/FeatureServer/0",
    geometryType: null,
    outFields: ["*"],
    editingEnabled: true,
    apiKey: import.meta.env.VITE_API_KEY,
});

export default goalPhaseLayer;
