import React from 'react'

import { POSTJsonFileToAPI } from '../util/requests';
import { setLSObject, removeKeyFromCoordsObject, getLocalStorageVariable, LS_SAVED_COORDS_KEY, LS_ANNO } from '../util/handleLS';

const ManageFeaturePopUp = ({onClose, onCloseReload, LSFeatureRef, featureName}) => {
  
  const [incr, setIncr] = React.useState(0);

  //Check if user has edited anything, if so, Gotta RELOAD Three
  const onCloseHandle = () => {
    if(incr > 0){
      onCloseReload();
    } else {
      onClose();
    }
  }

  const handleBackgroundClick = e => {
        if (e.target === e.currentTarget) {
          onCloseHandle();
        };
  }

  function download_LS_VAR_2_JSON(localStorageKey, filename) {
    // Retrieve data from local storage
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

    // Stringify the data with indents
    var jsonString = JSON.stringify(jsonData, null, 2);

    // Create a Blob from the JSON string
    var blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });

    // Create a URL for the Blob
    var url = URL.createObjectURL(blob);

    // Create an anchor tag and click it to download the file
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  }

  function PostJSONFileCallback(json) {
    console.log(json);
  }

  const manageFeatureSwitch = () => {
    
    //!ASSERT: If any of the objects are Empty, just say so

    const str = getLocalStorageVariable(LSFeatureRef); //Saved Coords as JSON Str
    let obj = JSON.parse(str); //Point of Interests

    let objLen = Object.keys(obj).length

    if(!objLen) {
      return (
        <p style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{marginLeft: "2vw"}}>Sorry, however your {featureName} is empty ...</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style={{height : '50px'}}>
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
        </p>
      );
    }

    //Points of Interest Case:
    if(LSFeatureRef === LS_SAVED_COORDS_KEY) {
      return POI_manage();
    } else if (LSFeatureRef === LS_ANNO) {
      return ANNO_manage();
    }

  }

  const ANNO_manage = () => {
    let jsxDump = [];
    const anostr = getLocalStorageVariable(LS_ANNO); //Saved Coords as JSON Str
    let pois = JSON.parse(anostr); //Point of Interests

    for (const [key, value] of Object.entries(pois)) {
      
      const elm = (
        <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <input type="button" value="Remove" className="warning-button" onClick={() => {

             delete pois[key];
             setLSObject(LS_ANNO, pois); 

            setIncr(prev_state => prev_state + 1);
          }}/>
          <h4>{key}</h4>
          <p style={{marginLeft: "2vw"}}>
            <span style={{color: "slategray"}}>Severity: </span>
             {value.severity}</p>
        </div>
        </>
      );

      jsxDump.push(elm);
    }

    //* Add the Export to JSON Button
    jsxDump.push(<br></br>);
    
    jsxDump.push(<button className="blue-button" 
    onClick={() => { download_LS_VAR_2_JSON(LS_ANNO,"defects.json");}}> 
      Export Annotations to JSON File
    </button>)
    jsxDump.push(<br></br>);
    //* Add Upload to JSON Button
    jsxDump.push(<button className="blue-button"
    onClick={() => { POSTJsonFileToAPI(LS_ANNO,PostJSONFileCallback);}}> 
    Post Annotations JSON to API
    </button>)

    return jsxDump;
  }
  
  const POI_manage = () => {
    
    let jsxDump = [];
    const poisStr = getLocalStorageVariable(LS_SAVED_COORDS_KEY); //Saved Coords as JSON Str
    let pois = JSON.parse(poisStr); //Point of Interests

    for (const [key, value] of Object.entries(pois)) {
      
      const elm = (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <input type="button" value="Remove" className="warning-button" onClick={() => {
            removeKeyFromCoordsObject(key);
            setIncr(prev_state => prev_state + 1);
          }}/>
          <h4>{key}</h4>
        </div>
      );

      jsxDump.push(elm);
    }

    return jsxDump;

  }

  return (<div className="modal" onClick={handleBackgroundClick}>
  {/* INSIDE THE POP UP: */}
    <div className="modal-content">
      <button className="close-button" onClick={onCloseHandle} key={"close_manage_feature"}>Close</button>
      <h2 className="pop-up-title"> Manage : {featureName}</h2>
      {manageFeatureSwitch()}
    </div>
</div>);

}

export default ManageFeaturePopUp