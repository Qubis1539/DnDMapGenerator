import React from "react";
import { useState } from "react";
import { log } from "three/webgpu";

const ControlPanel = (settings, setSettings) => {
    console.log(settings);

    const rangeXChange = (e) => {
        setSettings({
            ...settings,
            mapSize: {
                x: e.target.value,
                y: settings.mapSize.y,
            },
        });
    };
    const rangeYChange = (e) => {
        setSettings({
            ...settings,
            mapSize: {
                x: settings.mapSize.x,
                y: e.target.value,
            },
        });
    };
    return (
        <div>
            <div className="controlPanel">
                <div className="controlPanel__field">
                    <label htmlFor="text">Map Size</label>
                    <input type="number" placeholder="X Cells" />x
                    <input type="number" placeholder="Y Cells" />
                    <label htmlFor="xRange">X:</label>
                    <input type="range" min="10" max="100" id="xRange" onChange={rangeXChange} />
                    <label htmlFor="yRange">Y:</label>
                    <input type="range" min="10" max="100" id="yRange" onChange={rangeYChange} />
                </div>

                <div className="controlPanel__field">
                    <label htmlFor="text">Map Type</label>
                    <select
                        value={settings.mapType}
                        onChange={(e) => setSettings({ ...settings, mapType: e.target.value })}
                    >
                        <option value="forest">Forest</option>
                        <option value="cave">Cave</option>
                        <option value="dunge">Dunge</option>
                        <option value="tavern">Tavern</option>
                        <option value="city">City</option>
                        <option value="random">Random</option>
                    </select>
                </div>

                <div className="controlPanel__field">
                    <label htmlFor="text">Map Seed</label>
                    <input type="text" placeholder="Seed" />
                </div>

                <div className="controlPanel__field">
                    <label htmlFor="text"></label>
                </div>
            </div>
        </div>
    );
};

export default ControlPanel;
