import CSVLayer from "@arcgis/core/layers/CSVLayer";
import gameConfig from "../../config/game.json";
import { ResourceName, ResourceNode } from "../types/resources";
import ResourceNodeImg from "../assets/ResourceNodeImg";

const res = await fetch("/nodes.csv");
const nodes = await res.text();

const blob = new Blob([nodes], {
    type: "text/csv",
});

const csvUrl = URL.createObjectURL(blob);

const resourceNodesLayer = new CSVLayer({
    url: csvUrl,
    latitudeField: "latitude",
    longitudeField: "longitude",
    popupTemplate: {
        title: "{name}",
        content: `
			<b>Resource Type: </b> {resource} <br>
			<b>Purity: </b> {purity} <br>
		`,
    },
    renderer: {
        type: "unique-value",
        field: "resource",
        defaultSymbol: { type: "simple-fill" },
        uniqueValueInfos: [
            {
                label: "Copper Node",
                value: "Copper",
                symbol: {
                    type: "picture-marker",
                    url: ResourceNodeImg.Copper,
                    width: "60px",
                    height: "60px",
                },
            },
            {
                label: "Iron Node",
                value: "Iron",
                symbol: {
                    type: "picture-marker",
                    url: ResourceNodeImg.Iron,
                    width: "60px",
                    height: "60px",
                },
            },
            {
                label: "Coal Node",
                value: "Coal",
                symbol: {
                    type: "picture-marker",
                    url: ResourceNodeImg.Coal,
                    width: "60px",
                    height: "60px",
                },
            },
            {
                label: "Wood Node",
                value: "Wood",
                symbol: {
                    type: "picture-marker",
                    url: ResourceNodeImg.Wood,
                    width: "60px",
                    height: "60px",
                },
            },
        ],
    },
});

const resourceSummary = resourceNodesLayer
    .queryFeatures()
    .then((featuresSet) => {
        return new Promise<Record<ResourceName, number>>((res) => {
            const totalResource = featuresSet.features.reduce((prev, curr) => {
                const { resource, purity } =
                    curr.attributes as unknown as ResourceNode;

                if (!Object.prototype.hasOwnProperty.call(prev, resource)) {
                    prev[resource] = gameConfig.purities[purity];
                } else {
                    prev[resource] += gameConfig.purities[purity];
                }

                return prev;
            }, {} as Record<ResourceName, number>);

            res(totalResource);
        });
    });

export default resourceNodesLayer;
export { resourceSummary };
