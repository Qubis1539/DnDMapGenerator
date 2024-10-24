import React, { useEffect } from "react";
import { useState } from "react";
import { log } from "three/webgpu";
import cn from "classnames";
import "../assets/controlPanel.css";

const ControlPanel = ({ settings, setSettings }) => {
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
	const handleChangeSetting = (mapType, setting, value) => {
		// console.log(1);

		setSettings({
			...settings,
			mapTypeSettings: {
				...settings.mapTypeSettings,
				[mapType]: {
					...settings.mapTypeSettings[mapType],
					[setting]: value,
				},
			},
		});
	};
	const generateCheckboxField = (mapType, mapTypeSetting) => {
		return (
			<>
				<input
					type="checkbox"
					id="checkbox"
					checked={settings.mapTypeSettings[mapType][mapTypeSetting]}
					onChange={(e) => {
						handleChangeSetting(
							mapType,
							mapTypeSetting,
							e.target.checked
						);
					}}
				/>
			</>
		);
	};
	const generateInputField = (mapType, mapTypeSetting) => {
		return (
			<>
				<input
					type="number"
					id={mapTypeSetting}
					value={settings.mapTypeSettings[mapType][mapTypeSetting]}
					onChange={(e) => {
						handleChangeSetting(
							mapType,
							mapTypeSetting,
							e.target.value
						);
					}}
				/>
				<input
					type="range"
					min="1"
					max="100"
					value={settings.mapTypeSettings[mapType][mapTypeSetting]}
					onChange={(e) =>
						handleChangeSetting(
							mapType,
							mapTypeSetting,
							e.target.value
						)
					}
				/>
			</>
		);
	};
	const mapTypeControl = (e) => {
		// console.log(settings.mapTypeSettings["forest"]);
		const mapType = settings.mapType;
		return Object.keys(settings.mapTypeSettings[mapType]).map(
			(mapTypeSetting) => {
				return (
					<div
						className="controlPanel__field controlPanel__row"
						key={mapTypeSetting}
					>
						<label>{mapTypeSetting}</label>
						{mapTypeSetting.includes("is_")
							? generateCheckboxField(mapType, mapTypeSetting)
							: generateInputField(mapType, mapTypeSetting)}
					</div>
				);
			}
		);
	};
	const generateMap = () => {};
	useEffect(() => {
		// console.log(settings);
	});
	const toggleMenu = () => {
		setSettings({
			...settings,
			UI: {
				...settings.UI,
				showControls: !settings.UI.showControls,
			},
		});
	};
	const controlPanelClasses = cn("controlPanel__container", {
		show: settings.UI.showControls,
	});
	return (
		<div className={controlPanelClasses}>
			<div className="controlPanel">
				<div className="controlPanel__burger" onClick={toggleMenu}>
					<svg
						fill="#fff"
						className="arrow"
						// height="800px"
						// width="800px"
						version="1.1"
						id="Layer_1"
						xmlns="http://www.w3.org/2000/svg"
						xmlnsXlink="http://www.w3.org/1999/xlink"
						viewBox="0 0 404.258 404.258"
						xmlSpace="preserve"
					>
						<polygon points="289.927,18 265.927,0 114.331,202.129 265.927,404.258 289.927,386.258 151.831,202.129 " />
					</svg>
				</div>
				<div className="controlPanel__field">
					<label htmlFor="text">Map Size</label>
					<div className="controlPanel__row mapSizeController">
						<div className="mapSizeController__field">
							<input
								type="number"
								placeholder="X Cells"
								value={settings.mapSize.x}
								onChange={rangeXChange}
							/>
							<input
								type="range"
								min="1"
								max="100"
								id="xRange"
								value={settings.mapSize.x}
								onChange={rangeXChange}
							/>
						</div>
						x
						<div className="mapSizeController__field">
							<input
								type="number"
								placeholder="Y Cells"
								value={settings.mapSize.y}
								onChange={rangeYChange}
							/>
							<input
								type="range"
								min="1"
								max="100"
								id="yRange"
								value={settings.mapSize.y}
								onChange={rangeYChange}
							/>
						</div>
					</div>
				</div>
				<div className="controlPanel__field">
					<label htmlFor="text">Map Seed</label>
					<input type="text" placeholder="Seed" />
				</div>
				<div className="controlPanel__field">
					<label htmlFor="text">Map Type</label>
					<select
						value={settings.mapType}
						onChange={(e) =>
							setSettings({
								...settings,
								mapType: e.target.value,
							})
						}
					>
						{Object.keys(settings.mapTypeSettings).map((type) => {
							return (
								<option
									key={type}
									value={type}
									defaultValue={true}
								>
									{type}
								</option>
							);
						})}
					</select>
				</div>

				{mapTypeControl()}

				<button onClick={generateMap}>Generate</button>
			</div>
		</div>
	);
};

export default ControlPanel;
