import CSVLayer from "@arcgis/core/layers/CSVLayer";

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
                    url: "/resources/copper.png",
                    width: "60px",
                    height: "60px",
                },
            },
            {
                label: "Iron Node",
                value: "Iron",
                symbol: {
                    type: "picture-marker",
                    url: "/resources/iron.png",
                    width: "60px",
                    height: "60px",
                },
            },
            {
                label: "Coal Node",
                value: "Coal",
                symbol: {
                    type: "picture-marker",
                    url: "/resources/coal.png",
                    width: "60px",
                    height: "60px",
                },
            },
            {
                label: "Wood Node",
                value: "Wood",
                symbol: {
                    type: "picture-marker",
                    url: "/resources/wood.png",
                    width: "60px",
                    height: "60px",
                },
            },
        ],
    },
});

export default resourceNodesLayer;
