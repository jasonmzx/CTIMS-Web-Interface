import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

//Three Example JSM Loaders:

import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { NRRDLoader } from 'three/examples/jsm/loaders/NRRDLoader';

//React libs
import { GUI } from 'lil-gui';

//Local stuff
import { PostNrrdFile } from '../util/requests';

const Interface = () => {


    function iLog  (string) {
        console.log('%c[Interface.js] '+string, 'background: #34568B; color: #EFC050')
    }

    let mount = useRef(null);


    //UI State:

    const [rs, setRs] = React.useState('❌');
    const [is, setIs] = React.useState('❌');


    //API React state(s):

    const [formData, setFormData] = React.useState(() => new FormData());

    //Loaded Data File States:

    const [warningHeader,setWarningHeader] = React.useState(null);


    //Blob URL paths:

    const [referenceNRRD, setReference_NRRD] = React.useState(null);
    const [inputNRRD, setInput_NRRD] = React.useState("/nrrd_ressources/volume_ref.nrrd");

    const [api_POSTED_NRRD, setAPN] = React.useState(null); //Mask response from FastAPI



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

    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'file';
    hiddenInput.accept = '.nrrd';
    hiddenInput.style.display = 'none';
    document.body.appendChild(hiddenInput);
    
    // Function to handle file selection
    const handleFileSelection = (file, setReference_NRRD, setRs) => {
      setFormData((prevFormData) => {
        prevFormData.append("file", file);
        console.log("[ set form data ]");
        return prevFormData;
      });
    
      // Create a FileReader to read the contents of the file
      const reader = new FileReader();
    
      // Set an onload function to handle the file data
      reader.onload = function(e) {
        const fileData = e.target.result;
    
        // TODO: Add code to load the .NRRD file with the path.
      };
      const blobUrl = URL.createObjectURL(file);
    
      setWarningHeader(<div className="banner b_loading"> Successfully Loaded in {file.name} </div>);
      setReference_NRRD(blobUrl);
      setRs('✔');
    };

    useEffect(() => {

    //! ########################## Hovering GUI in the Top-Right ( lil-gui.js ) ##########################

        const defaultGUI = {
            ref_nrrd_upload :  () => {
            //&Sets to Reference NRRD States:
                hiddenInput.addEventListener('change', (event) => {
                  const file = event.target.files[0];
                  handleFileSelection(file, setReference_NRRD, setRs);
                });
            
                hiddenInput.click();
              },
            
            input_nrrd_upload :  () => {
            //&Sets to Input NRRD States:
                hiddenInput.addEventListener('change', (event) => {
                  const file = event.target.files[0];
                  handleFileSelection(file, setInput_NRRD, setIs);
                });
            
                hiddenInput.click();
            },  

            post :  () => {
                //Returns file URL
                PostNrrdFile(formData, setAPN);
            }
        }

        // GUI setup
        const gui = new GUI();

        //GUI File Inputs Section:
        const GUI_INPUT = gui.addFolder('Add Scans (.nrrd)');

        GUI_INPUT.add(defaultGUI, "ref_nrrd_upload").name("Add Reference Scan "+rs);
        GUI_INPUT.add(defaultGUI, "input_nrrd_upload").name("Add Input Scan"+is);
        GUI_INPUT.add(defaultGUI, "post").name("Post !");


        //! ########################## THREE.js Setup ##########################

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

        camera.position.x = 300;
        camera.position.y = 300;
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


        // NRRDLoader setup
        const loader1 = new NRRDLoader();
        const loader2 = new NRRDLoader();

        let volume1, volume2; // We'll store the volumes here so they can be accessed later

        // Load and add first volume to the scene
        loader1.load(referenceNRRD, function (volume) {
            volume1 = volume;

            volume1.boundingBox = createBoundingBox(volume1);
            scene.add(volume1.boundingBox);
            setupGui(); // Try to setup the GUI after each volume loads
        });

        
        // Load and add second volume to the scene
        loader2.load(api_POSTED_NRRD, function (volume) {
            volume2 = volume;
            setupGui(); // Try to setup the GUI after each volume loads
        });

    
    //! SETUP GUI FUNCTION : 

    //? Note, the SETUP function should be in the Use.Effect Scope
    function setupGui() {

            const INITIAL_OPACITY_OF_DEFECT = 0.5;

            // Make sure both volumes have loaded
            if (!volume1 || !volume2) {
                setWarningHeader(<div className="banner b_error">You don't have any scans uploaded, navigate to: Add Scans (.nrrd)</div>);
                return;
            } else {
                setWarningHeader(null);
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

            //Upon Initializing, add some Opacity to Slices2
            [...Object.values(slices2)].forEach(slice => {
                slice.mesh.material.opacity = INITIAL_OPACITY_OF_DEFECT;
                slice.mesh.material.transparent = true; // Enable transparency
                slice.mesh.material.needsUpdate = true; // Required for material property changes to take effect
            });

            //! BANDAID: Fix the Z offset bug:
            slices2.z.index = slices1.z.index;
        
            // Add slices to scene
            Object.values(slices1).forEach(slice => scene.add(slice.mesh));
            Object.values(slices2).forEach(slice => {
                slice.mesh.material.color.set(0x00ff00); // Change color
                scene.add(slice.mesh);
            });

            const fixPOS = 350;

            const cameraPositions = {
                setX: function() {
                    camera.position.set(500, 0, 0); // adjust as necessary
                    camera.lookAt(scene.position);
                    sliceSetHelper(fixPOS,700,0,1,[slices1,slices2]);
                },
                setY: function() {
                    camera.position.set(0, 500, 0); // adjust as necessary
                    camera.lookAt(scene.position);
                    sliceSetHelper(0,fixPOS,0,1,[slices1,slices2]);
                },
                setZ: function() {
                    camera.position.set(0, 0, 500); // adjust as necessary
                    camera.lookAt(scene.position);
                    sliceSetHelper(0,700,fixPOS,1,[slices1, slices2]);
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
            GUI_VOLUMES.add({ opacity: INITIAL_OPACITY_OF_DEFECT }, 'opacity', 0, 1).name('Opacity').onChange(function (value) {

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

        iLog("Mounting...");
        // Clean up on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
            mount.current.removeChild(renderer.domElement);
        };
    }, [inputNRRD, api_POSTED_NRRD, referenceNRRD]);

    return (
        <>
      {warningHeader}
        <div ref={mount} style={{width: '100%', height: '100vh'}} />
        </>
    );
}

export default Interface;
