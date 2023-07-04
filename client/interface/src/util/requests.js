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
