import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import resourceNodesLayer from "../layers/resourceNodes";
import arcgisConfig from "../../config/arcgis.json";
import esriConfig from "@arcgis/core/config";
import config from "../../config/arcgis.json";
import searchWidget from "../widget/SearchWidget";

export default class MapService {
    private static instance: MapService | null = null;
    private map!: Map;
    private view!: MapView;

    constructor() {
        if (MapService.instance != null) return MapService.instance;

        esriConfig.apiKey = config.apiKey;

        MapService.instance = this;
        this.map = new Map({
            layers: [resourceNodesLayer],
            ...arcgisConfig.map,
        });

        this.view = new MapView({
            map: this.map,
            ...arcgisConfig.mapView,
        });

        searchWidget.view = this.view;

        this.view.ui.add(searchWidget, { position: "top-right" });
    }

    public getMap() {
        return this.map;
    }

    public getMapView() {
        return this.view;
    }
}
