import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { NRRDLoader } from 'three/examples/jsm/loaders/NRRDLoader';
import { GUI } from 'lil-gui'; // Uncomment this if you want to use GUI

const Interface = () => {
    let mount = useRef(null);

    const [loadedNRRDstr , setLnrrd] = React.useState("/volume.nrrd");

    useEffect(() => {
        // Scene, camera, and renderer setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, mount.current.clientWidth / mount.current.clientHeight, 0.01, 1e10);
        const renderer = new THREE.WebGLRenderer();
        
        // Add hemisphere and directional light
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
        scene.add(hemiLight);
        
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
        dirLight.position.set(200, 200, 200);
        scene.add(dirLight);

        camera.position.z = 300;
        scene.add(camera);

        // Mount renderer to DOM
        mount.current.appendChild(renderer.domElement);
        renderer.setSize(mount.current.clientWidth, mount.current.clientHeight);

        // TrackballControls setup
        const controls = new TrackballControls(camera, renderer.domElement);
        controls.minDistance = 100;
        controls.maxDistance = 500;
        controls.rotateSpeed = 5.0;
        controls.zoomSpeed = 5;
        controls.panSpeed = 2;
        controls.update();

        // NRRDLoader setup
        const loader = new NRRDLoader();
        loader.load(loadedNRRDstr, function (volume) {
            //box helper to see the extent of the volume
            const geometry = new THREE.BoxGeometry(volume.xLength, volume.yLength, volume.zLength);
            const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
            const cube = new THREE.Mesh(geometry, material);
            cube.visible = false;
            const box = new THREE.BoxHelper(cube);
            scene.add(box);
            box.applyMatrix4(volume.matrix);
            scene.add(cube);

            // Add slices
            const sliceZ = volume.extractSlice('z', Math.floor(volume.RASDimensions[2] / 4));
            scene.add(sliceZ.mesh);
            const sliceY = volume.extractSlice('y', Math.floor(volume.RASDimensions[1] / 2));
            scene.add(sliceY.mesh);
            const sliceX = volume.extractSlice('x', Math.floor(volume.RASDimensions[0] / 2));
            scene.add(sliceX.mesh);

            // Uncomment the following if you want to use GUI
            const gui = new GUI();
            gui.add(sliceX, 'index', 0, volume.RASDimensions[0], 1).onChange(() => sliceX.repaint());
            gui.add(sliceY, 'index', 0, volume.RASDimensions[1], 1).onChange(() => sliceY.repaint());
            gui.add(sliceZ, 'index', 0, volume.RASDimensions[2], 1).onChange(() => sliceZ.repaint());
        });

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
            controls.handleResize(); // update controls on window resize
        }
        
        window.addEventListener('resize', handleResize);

        // Clean up on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
            mount.current.removeChild(renderer.domElement);
        };
    }, [loadedNRRDstr]);

    return (
        <>
        <div ref={mount} style={{width: '100%', height: '95vh'}} />
        <div style={{height : '4vh'}} >
            
             MENU <button onClick={() => {setLnrrd('/I.nrrd')}}> SET TO I. NRRD Instead </button>
             
             
             </div>
        </>
    );
}

export default Interface;
