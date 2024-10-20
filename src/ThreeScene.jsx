// src/ThreeScene.js
import React, { useEffect } from "react";
import * as THREE from "three";

const ThreeScene = () => {
    useEffect(() => {
        // Инициализация сцены, камеры и рендера
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // Создание геометрии и материала
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ffff });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        camera.position.z = 5;

        // Функция анимации
        const animate = () => {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
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
