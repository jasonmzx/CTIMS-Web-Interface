import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { NRRDLoader } from 'three/examples/jsm/loaders/NRRDLoader';

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

        // OrbitControls setup
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.update();

        camera.position.z = 5;

        // NRRDLoader setup
        const loader = new NRRDLoader();
        loader.load('/fool.nrrd', function (volume) {
            console.log("Loaded...");
            // Assuming volume contains the volume data for the NRRD file
            var geometry = new THREE.BoxGeometry( volume.xLength, volume.yLength, volume.zLength );
            geometry.setAttribute('position', new THREE.BufferAttribute(volume.data, 3));
            
            // Add material to mesh (visible from both sides)
            var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
            const mesh = new THREE.Mesh(geometry, material);

            scene.add(mesh);
        });


        console.log("Adding??");

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
