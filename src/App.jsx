// src/App.js
import React from "react";
import { useState } from "react";
import ThreeScene from "./ThreeScene";
import ControlPanel from "./components/ControlPanel";

function App() {
    const [settings, setSettings] = useState({
        mapSize: {
            x: 10,
            y: 10,
        },
        mapType: "forest",
        mapSeed: "12345",
    });

    // const rangeXChange = (e) => {
    //     setSettings({
    //         ...settings,
    //         mapSize: {
    //             x: e.target.value,
    //             y: settings.mapSize.y,
    //         },
    //     });
    // };

    // const rangeYChange = (e) => {
    //     setSettings({
    //         ...settings,
    //         mapSize: {
    //             x: settings.mapSize.x,
    //             y: e.target.value,
    //         },
    //     });
    // };
    return (
        <div>
            <h1>Генератор окружений D&D</h1>
            <ThreeScene settings={settings} setSettings={setSettings} />
            <ControlPanel />
        </div>
    );
}

export default App;
