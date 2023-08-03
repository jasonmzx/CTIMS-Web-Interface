import { getLocalStorageVariable,getLSvarName } from "./handleLS";


export async function PostNrrdFile(formEntry, callback) {
  try {
    //Get's the LS Variable value of the `gateway variable`, needlessly bloated wrapper tbh
    const gatewayURL = getLocalStorageVariable(getLSvarName());

    console.log(gatewayURL);

    const RESPONSE = await fetch(gatewayURL+"/process_nrrd", {
      method: 'POST',
      body: formEntry
    });

    console.log(RESPONSE.status);

    if (!RESPONSE.ok) {
      throw new Error(`HTTP error! status: ${RESPONSE.status}`);
    }

    const fileBlob = await RESPONSE.blob();

    // Create a URL object from the file blob
    const fileURL = URL.createObjectURL(fileBlob);
    callback(fileURL);
    console.log(fileURL);

    return RESPONSE.status; //! Return A Status Code (With Blob?)
  } catch (error) {
    return error.message; //! Return Error String
  }
}


//? This function gets the Mask.NRRD file based on the process ID:

export async function GET_MASK_From_Process(processMaskURL, callback) {
  try {
    //Get's the LS Variable value of the `gateway variable`, needlessly bloated wrapper tbh
    const gatewayURL = getLocalStorageVariable(getLSvarName());

    console.log('GET_MASK_From_Process debug >> '+gatewayURL+'/get_mask_file/'+processMaskURL);

    const RESPONSE = await fetch(gatewayURL+"/get_mask_file/"+processMaskURL, {
      method: 'GET'
    });

    console.log(RESPONSE.status);

    if (!RESPONSE.ok) {
      throw new Error(`HTTP error! status: ${RESPONSE.status}`);
    }

    const fileBlob = await RESPONSE.blob();

    // Create a URL object from the file blob
    const fileURL = URL.createObjectURL(fileBlob);
    callback(fileURL);
    console.log(fileURL);

    return RESPONSE.status; //! Return A Status Code (With Blob?)
  } catch (error) {
    return error.message; //! Return Error String
  }
}

export async function POST_2_NRRDs_Begin_Process(formEntry, callback) {
  try {
    const gatewayURL = getLocalStorageVariable(getLSvarName());

    const RESPONSE = await fetch(gatewayURL+"/begin_nrrd_proc", {
      method: 'POST',
      body: formEntry
    });

    const jsonResp = await RESPONSE.json();
    console.log(jsonResp);

    return jsonResp;

  } catch (error) {
    return error.message;
  }
}

export async function NRRD_Check_Process(str) {
  try {
    const gatewayURL = getLocalStorageVariable(getLSvarName());

    const RESPONSE = await fetch(gatewayURL+"/check_nrrd_proc/"+str, {
      method: 'GET'
    });

    const jsonResp = await RESPONSE.json();
    return jsonResp;

  } catch (error) {
    return error.message;
  }
}


export async function PingServer() {
  try {
    // Get the LS Variable value of the `gateway variable`
    const gatewayURL = getLocalStorageVariable(getLSvarName());

    console.log(gatewayURL);
    
    const response = await fetch(gatewayURL + "/ping", {
      method: 'GET'
    });
    
    return response.json();
  } catch (error) {
    return { "error": error };
  }
}



//* ========== ========== ========== ========== ==========
//* >> FLOOD FILL TOOL REQUESTS, INTERACTIVE SEGMENTATION 
//* ========== ========== ========== ========== ==========

export async function POSTFloodFill(x,y,z, xDim, yDim, zDim, nrrdName,scene,callback) {

  try {
    const gatewayURL = getLocalStorageVariable(getLSvarName());

    const RESPONSE = await fetch(gatewayURL+"/floodfill", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      //& #################### POST BODY HERE ####################
        body: JSON.stringify({
          "x": x,
          "y": y,
          "z": z,
          "threshold": 0,
          "filename": "nrrd_ressources/volume_mask.nrrd"
        })
      //& #################### ENDOF POST BODY HERE ####################
    });

    const jsonResp = await RESPONSE.json();
    callback(jsonResp["vertices"], scene, xDim, yDim, zDim, x, y, z);

  } catch (error) {
    return error.message;
  }
}
//* ========== ========== ========== ========== ==========
//* >> 2 POINT BOX FILL TOOL REQUESTS, INTERACTIVE SEGMENTATION 
//* ========== ========== ========== ========== ==========

export async function POSTBoxFill(p1, p2, xDim, yDim, zDim, nrrdName, scene, handleVerts_CALLBACK) {

  const body = {
    "p1": p1,
    "p2": p2,
    "threshold": 0,
    "filename": "nrrd_ressources/volume_mask.nrrd"
  }

  console.log(body)


  try {
    const gatewayURL = getLocalStorageVariable(getLSvarName());

    const RESPONSE = await fetch(gatewayURL+"/boxfill", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      //& #################### POST BODY HERE ####################
        body: JSON.stringify({
          "p1": p1,
          "p2": p2,
          "threshold": 0,
          "filename": "nrrd_ressources/volume_mask.nrrd"
        })
      //& #################### ENDOF POST BODY HERE ####################
    });

    const jsonResp = await RESPONSE.json();
    console.log(jsonResp);
    handleVerts_CALLBACK(jsonResp["vertices"], scene, xDim,yDim,zDim);

    return jsonResp;

  } catch (error) {
    return error.message;
  }
}

//* ========== ========== ========== ========== ==========
//* >> GET / POST of JSON Files for Defect
//* ========== ========== ========== ========== ==========

export async function POSTJsonFileToAPI(localStorageKey, callback) {
  try {
    const gatewayURL = getLocalStorageVariable(getLSvarName());
    var data = localStorage.getItem(localStorageKey);
    
    // Check if data is null or empty
    if (!data) {
        console.error('No data found in local storage with key:', localStorageKey);
        return;
    }
    
    // Parse the data to JSON
    var jsonData = null;
    try {
        jsonData = JSON.parse(data);
    } catch (e) {
        console.error('Invalid JSON data in local storage with key:', localStorageKey);
        return;
    }

    // Create a blob from your JSON object
    const blob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });

    // Append the blob to a new FormData object
    const formData = new FormData();
    formData.append('file', blob, "defects.json");

    const RESPONSE = await fetch(gatewayURL + "/upload_defect_json", {
      method: 'POST',
      body: formData
    });

    const jsonResp = await RESPONSE.json();
    callback(jsonResp);

  } catch (error) {
    return error.message;
  }
}
