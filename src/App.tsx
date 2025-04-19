import style from "./App.module.scss";
import MapWindow from "./components/Map/Map";

function App() {
    return (
        <div className={style.root}>
            <header className={style.header}></header>
            <main className={style.main}>
                <MapWindow />
                <aside></aside>
            </main>
        </div>
    );
}

export default App;
