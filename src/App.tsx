import { JSX, useReducer } from "react";
import style from "./App.module.scss";
import List, { ListItem } from "./components/List/List";
import MapWindow from "./components/Map/Map";
import ResourceInfo, { ResourceDetail } from "./components/ResourceInfo";
import Inventory from "./components/Inventory/inventory";

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
        element: <Inventory />,
    };
}

function App() {
    const [state, dispatch] = useReducer(sidebarReducer, {
        type: "default",
        element: <Inventory />,
    });

    return (
        <div className={style.root}>
            <header className={style.header}></header>
            <main className={style.main}>
                <MapWindow dispatch={dispatch} />
                <aside className={style.sidebar}>
                    {state.type != "default" ? (
                        <button
                            className={style.back__btn}
                            onClick={() => dispatch({ type: "default" })}
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
