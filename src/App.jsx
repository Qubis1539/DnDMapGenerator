// src/App.js
import React from "react";
import { useState } from "react";
import ThreeScene from "./ThreeScene";
import ControlPanel from "./components/ControlPanel";
import CanvasComponent from "./components/CanvasComponent";

function App() {
	const [settings, setSettings] = useState({
		UI: {
			showControls: false,
		},
		mapSize: {
			x: 1,
			y: 1,
		},
		mapType: "forest",
		mapTypeSettings: {
			forest: {
				bashes: 10,
				lootCount: 10,
				trees: 10,
				is_Beast: true,
				is_Human: true,
			},
			cave: {
				holes: 10,
				lootCount: 10,
				is_Beast: true,
				is_Human: true,
			},
			desert: {
				lootCount: 10,
				is_Beast: true,
				is_Human: true,
			},
			dungeon: {
				lootCount: 10,
				roomCount: 10,
				roomSize: 10,
			},
		},
		mapSeed: "12345",
	});
	const hi = () => {
		console.log("hi");
	};

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
			{/* <h1>Генератор окружений D&D</h1> */}
			<ControlPanel settings={settings} setSettings={setSettings} />

			<CanvasComponent />
			{/* <ThreeScene size={settings.mapSize} /> */}
		</div>
	);
}

export default App;
