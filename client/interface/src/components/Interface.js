//Main libs

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

//Three Example JSM Ressources that made this Project Possible:

import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { NRRDLoader } from 'three/examples/jsm/loaders/NRRDLoader';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

//React libs
import { GUI } from 'lil-gui';

//Local stuff
import { GET_MASK_From_Process, POST_2_NRRDs_Begin_Process, NRRD_Check_Process } from '../util/requests';
import SessionPopUp from './SessionPopUp';
import InspectionReqPopUp from './InspectionReqPopUp';
import WelcomePopUp from './WelcomePopUp';
import SaveCoordsPopUp from './SaveCoordsPopUp';
import SaveManualAnnotationPopUp from './SaveManualAnnotationPopUp';

import { getLocalStorageVariable, setLSObject} from '../util/handleLS'; //Functions
import { LS_SAVED_COORDS_KEY, LS_ANNO_CAPTURE_STATUS } from '../util/handleLS'; //Constants

const Interface = () => {


    function iLog  (string) {
        console.log('%c[Interface.js] '+string, 'background: #34568B; color: #EFC050')
    }

    let mount = useRef(null);


    //UI State:

    //& POP UPS:

    const [sessionPopUp, setSessionPopUp] = React.useState(<></>);
    const [inspectionReqPopUp, setInspectionReqPopUp] = React.useState(<></>);
    const [welcomePopUp, setWelcomePopUp] =  React.useState(<></>);
    const [saveCoordsPopUp,setSaveCoordsPopUp] = React.useState(<></>);
    const [saveManualAnnoPopUp, setManualAnnoPopUp]  = React.useState(<></>);
    
    const [rs, setRs] = React.useState('❌');
    const [is, setIs] = React.useState('❌');

    //API React state(s):

    const [formData, setFormData] = React.useState(() => new FormData());

    //Loaded Data File States:

    const [warningHeader,setWarningHeader] = React.useState(null);

    //! Potential Tick Bandaid fix:
    const [count, setCount] = React.useState(0);

    // Function to increment state
    const incrementCount = () => {
        setCount(prevCount => prevCount + 1);
    };



    //Blob URL paths:

    const [referenceNRRD, setReference_NRRD] = React.useState(null);
    const [inputNRRD, setInput_NRRD] = React.useState(null);

    const [api_POSTED_NRRD, setAPN] = React.useState(null); //Mask response from FastAPI

    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'file';
    hiddenInput.accept = '.nrrd';
    hiddenInput.style.display = 'none';
    document.body.appendChild(hiddenInput);
    
    // Function to handle file selection
    const handleFileSelection = (file, setReference_NRRD, setRs, fName) => {
      setFormData((prevFormData) => {

        prevFormData.append(fName, file);
        console.log("[ set form data ] "+fName);
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
    
      setWarningHeader(<div className="banner b_loading"> Loading `{file.name}` in... </div>);
      setReference_NRRD(blobUrl);
      setRs('✅');
    };


    //! NRRD Volumes POST Callback (from popup)

    const PostNRRDsProc = async () => {

        //CLEAR ANY Annotation Capture Status

        //CLEAR ANY Defined Annotations
        //TODO:

        //setAPN will set API mask resp:

        let resp = await POST_2_NRRDs_Begin_Process(formData);
        return resp;
    }

    const getMASKfile = async (Process_ID_String) => {

        setLSObject(LS_ANNO_CAPTURE_STATUS, {"p1":false,"p2":false});

        let resp = await GET_MASK_From_Process(Process_ID_String, setAPN);
        console.log("MASK APN SET");
    }


    useEffect(() => {

    //! ########################## Hovering GUI in the Top-Right -> Default Section ( lil-gui.js ) ##########################

        const defaultGUI = {
            ref_nrrd_upload :  () => { //! REFERENCE NRRD
            //&Sets to Reference NRRD States:
                hiddenInput.addEventListener('change', (event) => {
                  const file = event.target.files[0];
                  handleFileSelection(file, setReference_NRRD, setRs, "ref_file");
                });
            
                hiddenInput.click();
              },
            
            input_nrrd_upload :  () => { //! INPUT NRRD
            //&Sets to Input NRRD States:
                hiddenInput.addEventListener('change', (event) => {
                  const file = event.target.files[0];
                  handleFileSelection(file, setInput_NRRD, setIs, "input_file");
                });
            
                hiddenInput.click();
            },  

            toggle_session_popup : () => { //! GATEWAY SESSION POP UP TOGGLE
                setSessionPopUp(<SessionPopUp onClose={() => {setSessionPopUp(<></>)}}/>);
            },

            toggle_insp_req_popup : () => { //! INSPECTION POP UP TOGGLE
                setInspectionReqPopUp(<InspectionReqPopUp 
                    onClose={() => {setInspectionReqPopUp(<></>)}}
                    refBlob={referenceNRRD}
                    inpBlob={inputNRRD}
                    postNRRDs_cb={PostNRRDsProc}
                    checkNRRDproc_cb={NRRD_Check_Process}
                    getNRRDmask_cb ={getMASKfile}
                />);
            }
        }

        // GUI setup
        const gui = new GUI({ width: 370});

        //GUI File Inputs Section:

        gui.add(defaultGUI, "toggle_session_popup").name("Join Session");
        gui.add(defaultGUI, "toggle_insp_req_popup").name("Request Inspection");

        const GUI_ADD_SCANS_SECTION = gui.addFolder('Add Scans (.nrrd)');

        GUI_ADD_SCANS_SECTION.add(defaultGUI, "ref_nrrd_upload").name("Add Reference Scan "+rs);
        GUI_ADD_SCANS_SECTION.add(defaultGUI, "input_nrrd_upload").name("Add Input Scan"+is);



        
    //* ========== ========== ========== ========== ==========
    //* >> THREE Helpers
    //* ========== ========== ========== ========== ==========

    let textMeshes = [];

    const addTextMesh = (textMesh) => {
        textMeshes.push(textMesh);
    };
    

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

    const sliceSetHelper = (Xpos, Ypos, Zpos, slices) => {
        
        for(const slice of slices){

            //slice.x.index = Xpos;
            // slice.y.index = Ypos;
            // slice.z.index = Zpos;

            if(Xpos !== null){ slice.x.index = Xpos; }

            if(Ypos !== null){ slice.y.index = Ypos; }

            if(Zpos !== null){ slice.z.index = Zpos; }

            slice.x.repaint();
            slice.y.repaint();   
            slice.z.repaint();
        }
    }


    const removeSceneObject_ById = (scene, id) => {
        const objectToRemove = scene.children.find(obj => obj.userData.id === id);
        if (objectToRemove) {
            // Remove the object from the scene
            scene.remove(objectToRemove);
            // Dispose of the object's geometry and material to free up memory
            if (objectToRemove.geometry) {
                objectToRemove.geometry.dispose();
            }
            if (objectToRemove.material) {
                objectToRemove.material.dispose();
            }
        }
    }

    const createCone = (X,Y,Z, coneId, hexColor) => {
        const cone = new THREE.Mesh(
            new THREE.ConeGeometry(5, 20, 32),
            new THREE.MeshBasicMaterial({color: hexColor})
        );

        cone.rotation.x = Math.PI;
        cone.position.set(X, Y + 10, Z);

        // Assign a unique ID to the cone
        cone.userData.id = coneId;

        scene.add(cone);

        return cone;
    }

    const addTextMesh_withId = (X,Y,Z, textStr, id) => {

            let textMesh; //Mesh Variable for Text Renderings
            const loader = new FontLoader();

            loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
                const textGeometry = new TextGeometry(textStr, {
                    font: font,
                    size: 10,  // size of the text
                    height: 1,  // how much extrusion (how thick / deep are the letters)
                });

                // Create a basic material for the text with a color
                const textMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});

                // Create mesh with the geometry and material
                textMesh = new THREE.Mesh(textGeometry, textMaterial);

                // Position the text over the cone. Adjust as necessary.
                textMesh.position.set(X, Y + 30, Z);  // we set Y + 10 to position it above the cone
                id = id += "_label";

                textMesh.userData.id = id;

                   // Ensuring that the text is always rendered last and on top
        textMesh.renderOrder = 999;
        textMesh.onBeforeRender = function( renderer ) { renderer.clearDepth(); };

                // Add the text to the scene
                addTextMesh(textMesh);
                scene.add(textMesh);
                
            });
    }




        //! ########################## THREE.js Setup ##########################

        // Scene, camera, and renderer setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, mount.current.clientWidth / mount.current.clientHeight, 0.01, 1e10);
        const renderer = new THREE.WebGLRenderer();


        //!RAYCASTER
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const PointDeleteWrapper = (objectId) => {
                removeSceneObject_ById(scene, objectId);
                removeSceneObject_ById(scene, objectId+"_label");
                removeSceneObject_ById(scene, "select_box");

                //! LS : update capture Status
                let captureStatus = JSON.parse(getLocalStorageVariable(LS_ANNO_CAPTURE_STATUS));
                captureStatus[objectId] = false;
                console.log(captureStatus);
                setLSObject(LS_ANNO_CAPTURE_STATUS,captureStatus);                
        }

            // Create a click event listener
            window.addEventListener('click', function(event) {
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
                raycaster.setFromCamera(mouse, camera);
            
                // Cast the ray to all objects in the scene
                const intersects = raycaster.intersectObjects(scene.children);
            
                if (intersects.length > 0) {
                    // Log the ID of the intersected cone
                    
                    const objectId = intersects[0].object.userData.id;
                    if(objectId && objectId !== "select_box") {
                        PointDeleteWrapper(objectId);
        
                    } else {
                        console.log("Nothing was selected...");
                    }
                }
            }, false);

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

        //& Load and add first volume to the scene
        loader1.load(referenceNRRD, function (volume) {
            volume1 = volume;

            volume1.boundingBox = createBoundingBox(volume1);
            scene.add(volume1.boundingBox);
            setupGui(); // Try to setup the GUI after each volume loads
        });

        
        //& Load and add second volume to the scene
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
                setWarningHeader(<div className="banner b_error">Add Reference & Input Scans (.nrrd) {" >> "} Join Session {" >> "} Request Inspection</div>);
                return;
            } 
            else {
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
                z: volume2.extractSlice('z', Math.floor(volume2.RASDimensions[2] / 2))
            };

            //Upon Initializing, add some Opacity to Slices2
            [...Object.values(slices2)].forEach(slice => {
                slice.mesh.material.opacity = INITIAL_OPACITY_OF_DEFECT;
                slice.mesh.material.transparent = true; // Enable transparency
                slice.mesh.material.needsUpdate = true; // Required for material property changes to take effect
            });

            // Add slices to scene
            Object.values(slices1).forEach(slice => scene.add(slice.mesh));
            Object.values(slices2).forEach(slice => {
                slice.mesh.material.color.set(0x00ff00); // Change color
                scene.add(slice.mesh);
            });

            const fixPOS = 350;

            const volumeControlGUI = {
                setX: function() {
                    camera.position.set(500, 0, 0); // adjust as necessary
                    camera.lookAt(scene.position);
                    sliceSetHelper(fixPOS,700,0,[slices1,slices2]);
                },
                setY: function() {
                    camera.position.set(0, 500, 0); // adjust as necessary
                    camera.lookAt(scene.position);
                    sliceSetHelper(0,fixPOS,0,[slices1,slices2]);
                },
                setZ: function() {
                    camera.position.set(0, 0, 500); // adjust as necessary
                    camera.lookAt(scene.position);
                    sliceSetHelper(0,700,fixPOS,[slices1, slices2]);
                }
            };

            //Add Yellow Bounding box to scene
        
            // Create sliders
            const GUI_VOLUMES = gui.addFolder('Volume Inspection');
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

            GUI_VOLUMES.add(volumeControlGUI, 'setX').name('Camera to X');
            GUI_VOLUMES.add(volumeControlGUI, 'setY').name('Camera to Y');
            GUI_VOLUMES.add(volumeControlGUI, 'setZ').name('Camera to Z');


            //? ################ SHOW ALL COORDS IN MENU UPON REFRESH #####################

            const poiControlsGUI = {
                save_coords : function() {
                    const xP = slices1.x.index;
                    const yP = slices1.y.index;
                    const zP = slices1.z.index;

                    const xC = camera.position.x;
                    const yC = camera.position.y;
                    const zC = camera.position.z;

                    setSaveCoordsPopUp(<SaveCoordsPopUp 
                        onClose={ () =>{setSaveCoordsPopUp(<></>);
                    } }
                        onCloseReload ={ () =>{setSaveCoordsPopUp(<></>);
                        incrementCount(); }}

                        intArr={[xP, yP, zP, xC, yC, zC]}
                        />)

                    console.log(xP, yP, zP, xC, yC, zC);
            },

            setStar : function () {} //Literally doesn't do anything, placeholder for Dynamic coord setter fns
            }

            const GUI_POI = gui.addFolder('Positions of Interest');
            GUI_POI.add(poiControlsGUI, "save_coords").name("📷 Save Position 📷");

            let allCoords = getLocalStorageVariable(LS_SAVED_COORDS_KEY);

            // If the 'coords' object exists, parse it
            if (allCoords) {
                allCoords = JSON.parse(allCoords);
        
                // Loop through the keys of the 'coords' object
                for (let key in allCoords) {    

                    const keyStr = ">> "+key;

                    GUI_POI
                    .add(poiControlsGUI, "setStar")
                    .name(keyStr)
                    .onChange(() => {

                        const val = allCoords[key];


                        sliceSetHelper(val[0], val[1], val[2], [slices1,slices2]);
                        camera.position.x = val[3];
                        camera.position.y = val[4];
                        camera.position.z = val[5];
                    });
                    // Print the key and its corresponding array
                    console.log(`Key: ${key}, Value: ${JSON.stringify(allCoords[key])}`);
                }
            } else {
                console.log("No coordinates found in local storage");
            }

            //? ################ ANNOTATION GUI #####################

            const annotationControlsGUI = {
                capture_point : function () {

                    //& Computed at every State:
                    const xDim = volume1.RASDimensions[0];
                    const yDim = volume1.RASDimensions[1];
                    const zDim = volume1.RASDimensions[2];

                    const X = slices1.x.index - xDim/2;
                    const Y = slices1.y.index - yDim/2;
                    const Z = slices1.z.index - zDim/2;

                    console.log("#### CAPTURE POINT #####",X,Y,Z);
                    console.log(xDim,yDim,zDim);

                    //Assert current capture state
                    let captureStatus = getLocalStorageVariable(LS_ANNO_CAPTURE_STATUS);

                    if(captureStatus) { //Some kind of status is captured
                        console.log("Success");

                        let cS = JSON.parse(captureStatus);

                        // If p1 is False, capture it:
                        if(!cS["p1"]){
                            cS["p1"] = [X,Y,Z];
                            setLSObject(LS_ANNO_CAPTURE_STATUS, cS);
                            createCone(X,Y,Z, "p1", 0xffff00);
                            addTextMesh_withId(X,Y,Z,"Point 1", "p1"); //Add corresponding Billboard Label
                        }

                        // If p2 is False, capture it:
                        else if(!cS["p2"]){
                            cS["p2"] = [X,Y,Z];
                            setLSObject(LS_ANNO_CAPTURE_STATUS, cS);
                            createCone(X,Y,Z, "p2", 0x4d32f0);
                            addTextMesh_withId(X,Y,Z,"Point 2", "p2");//Add corresponding Billboard Label
                        } 

                        //Check again...

                        if(cS["p1"] && cS["p2"]) {
                                const X1 = cS["p1"][0];         const Y1 = cS["p1"][1];         const Z1 = cS["p1"][2];
                                const X2 = cS["p2"][0];         const Y2 = cS["p2"][1];         const Z2 = cS["p2"][2];
                        
                                                    // Create geometry of the box
                        const geometry = new THREE.BoxGeometry(X2 - X1, Y2 - Y1, Z2 - Z1);

                        // Create a yellow, semi-transparent material
                        const material = new THREE.MeshBasicMaterial({
                            color: 0xffff00,
                            opacity: 0.5,
                            transparent: true,
                        });

                        // Combine geometry and material to create a mesh
                        const box = new THREE.Mesh(geometry, material);

                        // Set the box's position so that it spans from (X1, Y1, Z1) to (X2, Y2, Z2)
                        box.position.set((X1 + X2) / 2, (Y1 + Y2) / 2, (Z1 + Z2) / 2);
                        box.userData.id = "select_box"
                        // Add the box to the scene
                        scene.add(box);
                        }

                        console.log(cS);

                    } else { //! Initialize Capture Status:

                        const anoStat =  {"p1" : [X,Y,Z] , "p2" : null}; //Set P1 first, naturely

                        setLSObject(LS_ANNO_CAPTURE_STATUS, anoStat);
                        
                        createCone(X,Y,Z, "p1", 0xffff00);
                    }


                }, //? ENDOF Capture_point

                delete_p1 : function () { PointDeleteWrapper("p1"); },
                delete_p2 : function () { PointDeleteWrapper("p2"); },
                add_annotation : function () {
                    console.log("hey");

                    //TODO: Check p1 and p2 aren't false

                    setManualAnnoPopUp(
                        <SaveManualAnnotationPopUp 
                        onClose={ () =>{setManualAnnoPopUp(<></>); }}
                        onCloseReload ={ () =>{setManualAnnoPopUp(<></>);
                        incrementCount(); }}
                        />
                    )
                }
            }


            //If both points are there, create bounding box

            const GUI_ANNO_VIEW = gui.addFolder('Annotations');
            GUI_ANNO_VIEW.add(annotationControlsGUI, "capture_point").name("Capture Point");
            GUI_ANNO_VIEW.add(annotationControlsGUI, "delete_p1").name("DELETE 🗙 Point 1");
            GUI_ANNO_VIEW.add(annotationControlsGUI, "delete_p2").name("DELETE 🗙 Point 2");
            GUI_ANNO_VIEW.add(annotationControlsGUI, "add_annotation").name("Save Capture");

        } //! ENDOF SETUP FUNCTION

        const animate = function () {

            requestAnimationFrame(animate);

            // "Billboarding effect for Text Rendered in 3D scene"
            textMeshes.forEach((textMesh) => {
                if (textMesh) textMesh.lookAt(camera.position);
            });


            // Orbit Controls update
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
    }, [inputNRRD, api_POSTED_NRRD, referenceNRRD,count]);

    React.useEffect( () => {
        setWelcomePopUp(<WelcomePopUp 
            onClose={() => {setWelcomePopUp(<></>)}}/>);
    }, [])

    return (<>
        {/* POP UP ELEMENTS (USUALLY DORMANT) */}
        {welcomePopUp}
        {sessionPopUp}
        {inspectionReqPopUp}

        {saveCoordsPopUp}
        {saveManualAnnoPopUp}

        {/*Actual UI of Interface+ */}
      {warningHeader}
        <div ref={mount} style={{width: '100%', height: '100vh'}} />
        </>);
}
export default Interface;
