//Imports
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
    

    //* ========== ========== ========== ========== ==========
    //* >> THREE Helpers
    //* ========== ========== ========== ========== ==========


export function sliceSetHelper(Xpos, Ypos, Zpos, slices) {

    //? NOTE: If any sliceSetHelper axis are set to `null`, they will be unaffected        
        
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

export function removeSceneObject_ById(scene, id) {
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

export function createConeTHREE(scene, X,Y,Z, coneId, hexColor){
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

export function create_box_from_2_pts_of_obj(scene, 
    DEFECT_LIST, 
    DEFECT_COLORS, 
    DEFECT_COLORS_TEXT, 
    obj, 
    boxColor, 
    boxId, 
    boxName,
    opacity, 
    textMeshes, FontLoader, TextGeometry 
    ) {
        
    const severity = obj["severity"];
    const idx = DEFECT_LIST.indexOf(severity);

    //If a boxColor isn't defined, assume it's a Saved Defect
    if(!boxColor) {
        boxColor = DEFECT_COLORS[idx];
    }

    //Takes in an object with keys "p1" and "p2" to be Arrays of 3 elms (each)
    const X1 = obj["p1"][0];         const Y1 = obj["p1"][1];         const Z1 = obj["p1"][2];
    const X2 = obj["p2"][0];         const Y2 = obj["p2"][1];         const Z2 = obj["p2"][2];

                                // Create geometry of the box
    const geometry = new THREE.BoxGeometry(X2 - X1, Y2 - Y1, Z2 - Z1);

    // Create a yellow, semi-transparent material
    const material = new THREE.MeshBasicMaterial({
        color: boxColor,
        opacity: opacity,
        transparent: true,
    });

    // Combine geometry and material to create a mesh
    const box = new THREE.Mesh(geometry, material);

    // Set the box's position so that it spans from (X1, Y1, Z1) to (X2, Y2, Z2)
    box.position.set((X1 + X2) / 2, (Y1 + Y2) / 2, (Z1 + Z2) / 2);
    box.userData.id = boxId;
    // Add the box to the scene
    scene.add(box);

    if(boxName){
        addTextMesh_withId(scene, FontLoader, TextGeometry, X1,Y1,Z1, boxId,boxName, DEFECT_COLORS_TEXT[idx], textMeshes ); //Hook it to the box Id for when this mesh gets deleted
    }
}

export function addTextMesh_withId (scene, FontLoader, TextGeometry, X,Y,Z, textStr, id, color,textMeshes) {

    let textMesh; //Mesh Variable for Text Renderings

    FontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
        const textGeometry = new TextGeometry(textStr, {
            font: font,
            size: 10,  // size of the text
            height: 1,  // how much extrusion (how thick / deep are the letters)
        });

        let textMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});

        if(color) { //If color is passed thru, set it
            textMaterial = new THREE.MeshBasicMaterial({color});
        }


        // Create mesh with the geometry and material
        textMesh = new THREE.Mesh(textGeometry, textMaterial);

        //! ALWAYS ON TOP breaks....
        // textMesh.renderOrder = 1000;  // Make Text Meshes, always on top
        // textMesh.material.depthTest = false;

        // Position the text over the cone. Adjust as necessary.
        textMesh.position.set(X, Y + 30, Z);  // we set Y + 10 to position it above the cone
        const textid = id += "_label";

        textMesh.userData.id = textid;

        // Add the text to the scene
        textMeshes.push(textMesh);
        scene.add(textMesh);
        
    });
}

export function verts_2_PointCloud(scene, xDim, yDim, zDim, vertices, annoName){
    let normalized_vertices = [];

    for (const v3 of vertices) {
        const X = v3[0] - xDim / 2;
        const Y = v3[1] - yDim / 2;
        const Z = v3[2] - zDim / 2;
        normalized_vertices.push(new THREE.Vector3(X, Y, Z));
    }

    // Create a geometry
    let geometry = new THREE.BufferGeometry();

    // Create a Float32Array from the normalized_vertices array
    let verticesArray = new Float32Array(normalized_vertices.length * 3); // three components per vertex

    for (let i = 0; i < normalized_vertices.length; i++) {
        verticesArray[i * 3] = normalized_vertices[i].x;
        verticesArray[i * 3 + 1] = normalized_vertices[i].y;
        verticesArray[i * 3 + 2] = normalized_vertices[i].z;
    }           

    // Assign attributes to the geometry
    geometry.setAttribute('position', new THREE.BufferAttribute(verticesArray, 3));

    // Create a material

    let material = new THREE.PointsMaterial({ color: 0xff0000, size: 1.5, sizeAttenuation: false });

    // Create a points (particle system)
    let points = new THREE.Points(geometry, material);
    points.userData.id = annoName;

    // Add the points to the scene
    scene.add(points);
}

export const unNormalizePoints = (array, xDim, yDim, zDim) => { // returns NRRD-accurate Coords
    if (array.length < 3) {
        throw new Error("Array must have at least 3 elements.");
    }
    array[0] += xDim/2;
    array[1] += yDim/2;
    array[2] += zDim/2;

    // Round all elements in the array to the nearest integer
    array = array.map(element => Math.round(element));

    return array;
}