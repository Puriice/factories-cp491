import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import resourceNodesLayer from "../layers/resourceNodes";
import arcgisConfig from "../../config/arcgis.json";
import esriConfig from "@arcgis/core/config";

export default class MapService {
    private static instance: MapService | null = null;
    private map!: Map;
    private view!: MapView;

    constructor() {
        if (MapService.instance != null) return MapService.instance;

        esriConfig.apiKey =
            "AAPTxy8BH1VEsoebNVZXo8HurNZ-ICH9Ibiwmmwlxup4Wa-vT7b7Uqwp1Ii84c2JtMl935ethAF8YJfWyY-JVe4M-VCfWI32ZNPJREfSQGNifb5fuKm962hQKgkmuTXMnhfGDbYkApR2RiMoUCIrUrqQmp4g8bOZ0yQm425hIs8vkB_MvMJcRn6MwW397e_hxegY9XasJN7C5ded8EcXLnbI455hP6rLNS24cd6aAQgfhljL3URH5efyLILqmCQOi7KCAT1_qI5ZhzZb";

        MapService.instance = this;
        this.map = new Map({
            layers: [resourceNodesLayer],
            ...arcgisConfig.map,
        });

        this.view = new MapView({
            map: this.map,
            ...arcgisConfig.mapView,
        });
    }

    public getMap() {
        return this.map;
    }

    public getMapView() {
        return this.view;
    }
}
