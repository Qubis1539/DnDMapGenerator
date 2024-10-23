// src/ThreeScene.js
import React, { useEffect } from "react";
import * as THREE from "three";

const ThreeScene = ({ size }) => {
	useEffect(() => {
		console.log(size);

		// Инициализация сцены, камеры и рендера
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(60, 1, 1, 2000);
		const renderer = new THREE.WebGLRenderer();

		// Установка размеров рендера
		const width = window.innerWidth - (window.innerWidth % 20);
		const height = window.innerHeight - (window.innerHeight % 20);
		renderer.setSize(width, height);
		document.body.appendChild(renderer.domElement);

		// Создание геометрии и материала
		const geometry = new THREE.BoxGeometry();

		// geometry.setSize(2, 2, 2);
		const material = new THREE.MeshBasicMaterial({ color: 0x00ffff });
		// const cube = new THREE.Mesh(geometry, material);

		const sheet = [];
		const startPosX = -width / 2 + 20;
		const startPosY = height / 2 - 20;
		const cubeSize = 20;
		for (let i = 0; i < 3; i++) {
			sheet.push([]);
			for (let j = 0; j < 3; j++) {
				const square2d = new THREE.PlaneGeometry(cubeSize, cubeSize);
				const cube2d = new THREE.Mesh(square2d, material);

				cube2d.position.set(
					startPosX + i * cubeSize + i,
					startPosY - j * cubeSize - j,
					0
				);
				sheet[i].push(cube2d);
				scene.add(cube2d);
			}
		}
		console.log(scene);

		// scene.add(cube);
		// scene.add(cube2d);

		camera.position.z = width / 2 / Math.tan((60 * Math.PI) / 360);
		// Функция анимации
		const animate = () => {
			requestAnimationFrame(animate);
			// cube.scale.set(size.x, size.y, 1);

			// cube2d.rotation.z += 0.01;
			// cube2d.rotation.y += 0.01;
			renderer.render(scene, camera);
		};
		animate();

		return () => {
			// Удаление рендера при размонтировании
			document.body.removeChild(renderer.domElement);
		};
	}, []);

	return null; // Этот компонент не рендерит ничего
};

export default ThreeScene;
