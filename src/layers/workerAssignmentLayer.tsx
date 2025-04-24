import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

const workerAssignmentLayer = new FeatureLayer({
    url: "https://services6.arcgis.com/LeDo6T0TXe79jtvH/arcgis/rest/services/WorkerAssignment/FeatureServer/0",
    layerId: 0,
    outFields: ["*"],
    geometryType: null,
    editingEnabled: true,
});

export default workerAssignmentLayer;
