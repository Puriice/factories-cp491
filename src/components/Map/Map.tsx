import { useEffect, useRef } from "react";
import style from "./scss/Map.module.scss";
import resourceNodesLayer, {
    resourceSummary,
} from "../../layers/resourceNodes";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";
import gameConfig from "../../../config/game.json";
import { ResourceNode } from "../../types/resources";
import { ListItem } from "../List/List";
import ResourceNodeImg from "../../assets/ResourceNodeImg";
import MapService from "../../services/MapServices";
import { SidebarAction } from "../../App";
import searchWidget from "../../widget/SearchWidget";

function isGraphicHit(
    viewHit: __esri.MapViewViewHit
): viewHit is __esri.MapViewGraphicHit {
    return viewHit.type == "graphic";
}

function MapWindow(props: MapWindowProps) {
    const { dispatch } = props;

    const selectButtonRef = useRef<HTMLDivElement>(null);
    const lineButtonRef = useRef<HTMLDivElement>(null);
    const clearButtonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const drawGraphicLayer = new GraphicsLayer();
        const mapService = new MapService();
        const map = mapService.getMap();
        const view = mapService.getMapView();

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
            resourceNodesLayer.featureEffect = null;
            dispatch({
                type: "default",
            });
        });

        sketchViewModel.on("create", async (event) => {
            // const features = resourceNodesLayer.queryFeatures();
            if (event.state != "complete") return;

            resourceNodesLayer.featureEffect = {
                filter: {
                    geometry: event.graphic.geometry,
                },
                includedEffect:
                    "drop-shadow(3px, 3px, 3px, gray) brightness(1.2)",
                excludedEffect: "opacity(30%)",
            };

            const featureSet = resourceNodesLayer.queryFeatures({
                geometry: event.graphic.geometry,
            });

            const [{ features }, totalResource] = await Promise.all([
                featureSet,
                resourceSummary,
            ]);

            const summary = features.reduce((prev, curr) => {
                const { resource, purity } =
                    curr.attributes as unknown as ResourceNode;

                if (!Object.prototype.hasOwnProperty.call(prev, resource)) {
                    prev[resource] = {
                        value: gameConfig.purities[purity],
                        maxValue: totalResource[resource],
                        icon: ResourceNodeImg[resource],
                    };
                } else {
                    prev[resource].value += gameConfig.purities[purity];
                }

                return prev;
            }, {} as Record<string, ListItem>);

            dispatch({
                type: "summary",
                payload: summary,
            });
        });

        view.on("click", async (event) => {
            if (event.buttons != 0) return;
            event.stopPropagation();

            const { results } = await view.hitTest(event, {
                include: resourceNodesLayer,
            });

            if (!results.length) {
                view.closePopup();
                dispatch({ type: "default" });
                return;
            }
            const [node] = results;

            if (!isGraphicHit(node)) return;

            view.openPopup({
                features: [node.graphic],
                location: event.mapPoint,
            });

            const {
                attributes,
            }: { attributes: ResourceNode & { __OBJECTID: number } } =
                node.graphic;

            const { __OBJECTID, name, resource, purity } = attributes;

            dispatch({
                type: "resource-click",
                payload: {
                    OBJECTID: __OBJECTID,
                    name,
                    resource,
                    purity,
                },
            });
        });

        searchWidget.on("search-complete", (event) => {
            const {
                attributes,
            }: { attributes: ResourceNode & { __OBJECTID: number } } =
                event.results[0].results[0].feature;

            const { __OBJECTID, name, resource, purity } = attributes;

            dispatch({
                type: "resource-click",
                payload: {
                    OBJECTID: __OBJECTID,
                    name,
                    resource,
                    purity,
                },
            });
        });

        return () => {};
    }, [dispatch]);

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

export interface MapWindowProps {
    dispatch: React.ActionDispatch<[action: SidebarAction]>;
}
