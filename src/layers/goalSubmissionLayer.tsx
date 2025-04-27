import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

const goalSubmissionLayer = new FeatureLayer({
    url: "https://services6.arcgis.com/LeDo6T0TXe79jtvH/arcgis/rest/services/FactoryGoal/FeatureServer/1",
    geometryType: null,
    outFields: ["*"],
    editingEnabled: true,
    apiKey: import.meta.env.VITE_API_KEY,
});

export default goalSubmissionLayer;
