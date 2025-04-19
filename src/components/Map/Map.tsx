import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import { useEffect, useRef, useState } from "react";
import style from "./scss/index.module.scss";
import arcgisConfig from "../../../config/arcgis.json";
import resourceNodesLayer from "../../layers/resourceNodes";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";
import gameConfig from "../../../config/game.json";
import { ResourceNode } from "../../types/resources";

function MapWindow() {
    const [, setMap] = useState<Map | null>(null);
    const [, setMapView] = useState<MapView | null>(null);

    const selectButtonRef = useRef<HTMLDivElement>(null);
    const lineButtonRef = useRef<HTMLDivElement>(null);
    const clearButtonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const map = new Map({
            layers: [resourceNodesLayer],
            ...arcgisConfig.map,
        });

        const view = new MapView({
            map: map,
            ...arcgisConfig.mapView,
        });

        setMap(map);
        setMapView(view);

        const drawGraphicLayer = new GraphicsLayer();

        map.add(drawGraphicLayer);

        const sketchViewModel = new SketchViewModel({
            view: view,
            layer: drawGraphicLayer,
        });

        view.ui.add("select-by-rectangle", "top-left");
        view.ui.add("draw-a-conveyor", "top-left");
        view.ui.add("clear-selection", "top-left");

        selectButtonRef.current?.addEventListener("click", () => {
            drawGraphicLayer.removeAll();
            sketchViewModel.create("rectangle");
        });

        clearButtonRef.current?.addEventListener("click", () => {
            drawGraphicLayer.removeAll();
        });

        sketchViewModel.on("create", async (event) => {
            // const features = resourceNodesLayer.queryFeatures();
            if (event.state != "complete") return;
            const featureSet = await resourceNodesLayer.queryFeatures({
                geometry: event.graphic.geometry,
            });

            const { features } = featureSet;

            const summary = features.reduce((prev, curr) => {
                const { resource, purity } =
                    curr.attributes as unknown as ResourceNode;

                if (!Object.prototype.hasOwnProperty.call(prev, resource)) {
                    prev[resource] = gameConfig.purities[purity];
                } else {
                    prev[resource] += gameConfig.purities[purity];
                }

                return prev;
            }, {} as Record<string, number>);

            console.log(summary);
        });
    }, []);

    return (
        <div className={style.root}>
            <div id="viewDiv" className={style.map}></div>
            <div
                ref={selectButtonRef}
                id="select-by-rectangle"
                className="esri-widget esri-widget--button esri-widget esri-interactive"
                title="Select features by rectangle"
            >
                <span className="esri-icon-checkbox-unchecked"></span>
            </div>
            <div
                ref={lineButtonRef}
                id="draw-a-conveyor"
                className="esri-widget esri-widget--button esri-widget esri-interactive"
                title="Select features by rectangle"
            >
                <span className="esri-icon-minus"></span>
            </div>
            <div
                ref={clearButtonRef}
                id="clear-selection"
                className="esri-widget esri-widget--button esri-widget esri-interactive"
                title="Clear selection"
            >
                <span className="esri-icon-erase"></span>
            </div>
        </div>
    );
}

export default MapWindow;
