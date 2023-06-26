import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { NRRDLoader } from 'three/examples/jsm/loaders/NRRDLoader';
import { GUI } from 'lil-gui';

const Interface = () => {
    let mount = useRef(null);

    const [loadedNRRDstr1, setLnrrd1] = React.useState("/nrrd_ressources/volume.nrrd");
    const [loadedNRRDstr2, setLnrrd2] = React.useState("/nrrd_ressources/mask.nrrd");
    

    function createBoundingBox(volume) {
        const boxGeometry = new THREE.BoxBufferGeometry(volume.xLength, volume.yLength, volume.zLength);
        const boxMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00, // Yellow color
            wireframe: true
        });
    
        const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
        boxMesh.visible = false; // Initially not visible
    
        return boxMesh;
    }

    //? NOTE: If any sliceSetHelper axis are set to `null`, they will be unaffected

    const sliceSetHelper = (Xpos, Ypos, Zpos, opacity, slices) => {
        
        for(const slice of slices){

            slice.x.index = Xpos;

            if(Xpos !== null){ slice.x.index = Xpos; }

            if(Ypos !== null){ slice.y.index = Ypos; }

            if(Zpos !== null){ slice.z.index = Zpos; }

            slice.x.repaint();
            slice.y.repaint();   
            slice.z.repaint();
        }
    }


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
        controls.maxDistance = 1000;
        controls.rotateSpeed = 5.0;
        controls.zoomSpeed = 5;
        controls.panSpeed = 2;
        controls.update();

        // GUI setup
        const gui = new GUI();

        // NRRDLoader setup
        const loader1 = new NRRDLoader();
        const loader2 = new NRRDLoader();

        let volume1, volume2; // We'll store the volumes here so they can be accessed later

        // Load and add first volume to the scene
        loader1.load(loadedNRRDstr1, function (volume) {
            volume1 = volume;

            volume1.boundingBox = createBoundingBox(volume1);
            scene.add(volume1.boundingBox);
            setupGui(); // Try to setup the GUI after each volume loads
        });
        
        // Load and add second volume to the scene
        loader2.load(loadedNRRDstr2, function (volume) {
            volume2 = volume;
            setupGui(); // Try to setup the GUI after each volume loads
        });
        
    
    //! SETUP GUI FUNCTION : 

    //? Note, the SETUP function should be in the Use.Effect Scope
    function setupGui() {
            // Make sure both volumes have loaded
            if (!volume1 || !volume2) {
                return;
            }
        
            // If we've reached this point, both volumes are ready
        
            // Extract slices for both volumes
            const slices1 = {
                x: volume1.extractSlice('x', Math.floor(volume1.RASDimensions[0] / 2)),
                y: volume1.extractSlice('y', Math.floor(volume1.RASDimensions[1] / 2)),
                z: volume1.extractSlice('z', Math.floor(volume1.RASDimensions[2] / 2))
            };
        
            const slices2 = {
                x: volume2.extractSlice('x', Math.floor(volume2.RASDimensions[0] / 2)),
                y: volume2.extractSlice('y', Math.floor(volume2.RASDimensions[1] / 2)),
                z: volume2.extractSlice('z', Math.floor(volume2.RASDimensions[2] / 4))
            };
        
            // Add slices to scene
            Object.values(slices1).forEach(slice => scene.add(slice.mesh));
            Object.values(slices2).forEach(slice => {
                slice.mesh.material.color.set(0x00ff00); // Change color
                scene.add(slice.mesh);
            });

            const cameraPositions = {
                setX: function() {
                    camera.position.set(300, 0, 0); // adjust as necessary
                    camera.lookAt(scene.position);
                },
                setY: function() {
                    camera.position.set(0, 300, 0); // adjust as necessary
                    camera.lookAt(scene.position);
                },
                setZ: function() {
                    camera.position.set(0, 0, 500); // adjust as necessary
                    camera.lookAt(scene.position);
                    sliceSetHelper(0,0,null,1,[slices1, slices2]);
                }
            };

            //Add Yellow Bounding box to scene
        
            // Create sliders
            const GUI_VOLUMES = gui.addFolder('Volume Main');
            ['x', 'y', 'z'].forEach(axis => {
                GUI_VOLUMES.add(slices1[axis], 'index', 0, volume1.RASDimensions[0], 1).name(`${axis.toUpperCase()}-axis`).onChange(() => {
                    slices1[axis].repaint();
                    slices2[axis].index = slices1[axis].index; // Sync the index
                    slices2[axis].repaint();
                });
            });
        
            // Add opacity controller
            GUI_VOLUMES.add({ opacity: 0.5 }, 'opacity', 0, 1).name('Opacity').onChange(function (value) {

                [...Object.values(slices2)].forEach(slice => {
                    slice.mesh.material.opacity = value;
                    slice.mesh.material.transparent = true; // Enable transparency
                    slice.mesh.material.needsUpdate = true; // Required for material property changes to take effect
                });
            });

            GUI_VOLUMES.add(volume1.boundingBox, 'visible').name('Toggle Contour Box');

            GUI_VOLUMES.add(cameraPositions, 'setX').name('Camera to X');
            GUI_VOLUMES.add(cameraPositions, 'setY').name('Camera to Y');
            GUI_VOLUMES.add(cameraPositions, 'setZ').name('Camera to Z');

        } //! ENDOF SETUP FUNCTION

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
            controls.handleResize();
        }
        
        window.addEventListener('resize', handleResize);

        // Clean up on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
            mount.current.removeChild(renderer.domElement);
        };
    }, [loadedNRRDstr1, loadedNRRDstr2]);

    return (
        <>
        <div ref={mount} style={{width: '100%', height: '95vh'}} />
        <div style={{height : '4vh'}} >
            MENU 
            <button onClick={() => {setLnrrd1('/I.nrrd'); setLnrrd2('/J.nrrd');}}>SET TO I. NRRD & J. NRRD Instead</button>
        </div>
        </>
    );
}

export default Interface;
