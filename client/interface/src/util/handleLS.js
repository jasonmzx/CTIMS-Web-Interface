

const LS_GATEWAY_KEY = "gateway";

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