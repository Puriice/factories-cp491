import { JSX, Suspense, use, useEffect, useReducer, useState } from "react";
import style from "./App.module.scss";
import List, { ListItem } from "./components/List/List";
import MapWindow from "./components/Map/Map";
import ResourceInfo, { ResourceDetail } from "./components/ResourceInfo";
import Loading from "./components/Loading";
import { loadWorkerService } from "./services/GameWorkerService";
import { loadInventoryService } from "./services/GameInventoryService";
import DefaultSidebar from "./components/DefaultSidebar";
import MapService from "./services/MapServices";
import MapView from "@arcgis/core/views/MapView";

function sidebarReducer(
    _state: SidebarState,
    action: SidebarAction
): SidebarState {
    if (action.type == "summary") {
        return {
            type: action.type,
            element: <List items={action.payload} />,
        };
    } else if (action.type == "resource-click") {
        return {
            type: action.type,
            element: <ResourceInfo info={action.payload} />,
        };
    }

    return {
        type: "default",
        element: <DefaultSidebar />,
    };
}

function App() {
    return (
        <Suspense fallback={<Loading />}>
            <AppLoader />
        </Suspense>
    );
}

function AppLoader() {
    use(loadWorkerService);
    use(loadInventoryService);

    return <AppRenderer />;
}

function AppRenderer() {
    const [state, dispatch] = useReducer(sidebarReducer, {
        type: "default",
        element: <DefaultSidebar />,
    });

    const [view, setView] = useState<MapView | null>(null);

    useEffect(() => {
        const mapService = new MapService();

        setView(mapService.getMapView());
    }, []);

    return (
        <div className={style.root}>
            <header className={style.header}></header>
            <main className={style.main}>
                <MapWindow dispatch={dispatch} />
                <aside className={style.sidebar}>
                    {state.type != "default" ? (
                        <button
                            className={style.back__btn}
                            onClick={() => {
                                view?.closePopup();
                                dispatch({ type: "default" });
                            }}
                        >
                            Back
                        </button>
                    ) : (
                        <></>
                    )}
                    {state.element}
                </aside>
            </main>
        </div>
    );
}

export default App;

export interface SidebarState {
    type: string;
    element: JSX.Element;
}

export type SidebarAction = SummaryAction | SymbolClickAction | DefaultAction;

export interface DefaultAction {
    type: "default";
}
export interface SummaryAction {
    type: "summary";
    payload: Record<string, ListItem>;
}

export interface SymbolClickAction {
    type: "resource-click";
    payload: ResourceDetail;
}
