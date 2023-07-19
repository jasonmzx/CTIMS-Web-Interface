

export const LS_GATEWAY_KEY = "gateway"; //API Gateway Key
export const LS_SAVED_COORDS_KEY = "coords"; //Saved Coordinates for Easy Viewing

export const LS_ANNO_CAPTURE_STATUS = "capture_status"; //Annotation Capture Status
export const LS_ANNO = "manual_annotation"; // Saved Manual Annotations

export function   getLSvarName(){ return LS_GATEWAY_KEY};

export function getLocalStorageVariable(variableName)  {
    // Check if the variable exists in localStorage
    if (localStorage.getItem(variableName)) {
      // If the variable exists, return its value
      return localStorage.getItem(variableName);
    } else {
      // If the variable does not exist, return null
      return null;
    }
  }
  
export function setLocalStorageVariable(variableName, value) {
    // Set the value of the variable in localStorage
    localStorage.setItem(variableName, value);
    // If the value was set successfully, return true
    return localStorage.getItem(variableName) === value;
  }

// Saving Coordinates LS Wrappers:


//chatgpt: Added all these LS wrappers for coords (with Proper assertions)

    //!Add a new key to the coords object
    export function addKeyToCoordsObject(key, value) {
      // Assert that the key is a string and the value is an array of integers of length 3
      if (typeof key !== 'string' || !Array.isArray(value) || value.length !== 6) {
          throw new Error('Invalid input: key must be a string and value must be an array of integers of length 3');
      }

      // Get the coords object from local storage
      let coordsObject = getLocalStorageVariable(LS_SAVED_COORDS_KEY);

      // If the coords object does not exist, initialize it
      if (!coordsObject) {
          coordsObject = {};
      } else {
          // If the coords object exists, parse it
          coordsObject = JSON.parse(coordsObject);
      }

      // Add the new key and value to the coords object
      coordsObject[key] = value;

      // Save the updated coords object to local storage
      setLocalStorageVariable(LS_SAVED_COORDS_KEY, JSON.stringify(coordsObject));
    }

    //!Remove a key from the coords object
    export function removeKeyFromCoordsObject(key) {
      // Assert that the key is a string
      if (typeof key !== 'string') {
          throw new Error('Invalid input: key must be a string');
      }

      // Get the coords object from local storage
      let coordsObject = getLocalStorageVariable(LS_SAVED_COORDS_KEY);

      // If the coords object exists, parse it and remove the key
      if (coordsObject) {
          coordsObject = JSON.parse(coordsObject);
          delete coordsObject[key];

          // Save the updated coords object to local storage
          setLocalStorageVariable(LS_SAVED_COORDS_KEY, JSON.stringify(coordsObject));
      }
    }

    //!Get a value from the coords object by key
    export function getValueFromCoordsObjectByKey(key) {
      // Assert that the key is a string
      if (typeof key !== 'string') {
          throw new Error('Invalid input: key must be a string');
      }

      // Get the coords object from local storage
      let coordsObject = getLocalStorageVariable(LS_SAVED_COORDS_KEY);

      // If the coords object exists, parse it and return the value associated with the key
      if (coordsObject) {
          coordsObject = JSON.parse(coordsObject);
          return coordsObject[key];
      }

      // If the coords object does not exist or the key is not in the object, return null
      return null;
    }


//* ========== ========== ========== ========== ==========
//* >> General LS Functions
//* ========== ========== ========== ========== ==========

  export function setLSObject(key,obj) {
      if (typeof obj !== 'object' || obj === null) {
        throw new Error('Invalid input: coordsObject must be a non-null object');
    }
    setLocalStorageVariable(key, JSON.stringify(obj));
  }



//chatgpt: Added all these LS wrappers for coords (with Proper assertions)