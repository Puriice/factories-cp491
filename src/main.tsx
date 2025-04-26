import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App.tsx";
import esriConfig from "@arcgis/core/config";

esriConfig.apiKey =
    "AAPTxy8BH1VEsoebNVZXo8HurNZ-ICH9Ibiwmmwlxup4Wa_LMfLMVZvyOnanQnldokVcD678x8l-c7LB9NSur64v85b53U77y0lgMtZowAPJ6nt6IPt4L6MkpFwAyiGntaWuVA_8cgVx8zf3B5k9Oh13Qk0XAwQz40-zmu5plSP4V7KyDsB-1qWx1V_N7nae09qMHAhjO7UkVIHIgkv33Ieaog7baCw740ksSV6wFopjAH8q_Be_hhUdnnMKstj6-xCpAT1_qI5ZhzZb";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
