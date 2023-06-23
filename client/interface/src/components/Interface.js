import React, { useRef, useEffect } from 'react';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Interface = () => {
    let mount = useRef(null);

    useEffect(() => {
        // Scene, camera, and renderer setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, mount.current.clientWidth / mount.current.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();

        // Mount renderer to DOM
        mount.current.appendChild(renderer.domElement);
        renderer.setSize(mount.current.clientWidth, mount.current.clientHeight);

        // Cube geometry setup
        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0, 1.0, 1.0,
            -1.0, 1.0, 1.0,
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, 1.0, -1.0,
            -1.0, 1.0, -1.0,
        ]);
        const indices = new Uint32Array([
            0, 2, 1, 0, 3, 2,
            4, 6, 5, 4, 7, 6,
            4, 3, 7, 4, 0, 3,
            1, 6, 5, 1, 2, 6,
            2, 7, 6, 2, 3, 7,
            0, 5, 4, 0, 1, 5
        ]);
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.setIndex(new THREE.BufferAttribute(indices, 1));

        // Cube material setup
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        // OrbitControls setup
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.update();

        camera.position.z = 5;

        const animate = function () {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };

        animate();

        // Handle browser window resize
        const handleResize = () => {
            const width = mount.current.clientWidth;
            const height = mount.current.clientHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }
        
        window.addEventListener('resize', handleResize);

        // Clean up on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
            mount.current.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <div ref={mount} style={{width: '100%', height: '100vh'}} />
    );
}

export default Interface;
