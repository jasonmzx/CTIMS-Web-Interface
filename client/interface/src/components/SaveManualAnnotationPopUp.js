import React from 'react'
import { getLocalStorageVariable, setLSObject, LS_ANNO_CAPTURE_STATUS, LS_ANNO } from '../util/handleLS';
import {DEFECT_LIST, cS_RESET} from '../util/constant';
import { unNormalizePoints } from '../util/ThreeHelper';

const SaveManualAnnotationPopUp = ({onClose, onCloseReload, volume}) => {
    

    const xDim = volume.RASDimensions[0];
    const yDim = volume.RASDimensions[1];
    const zDim = volume.RASDimensions[2];

    //React Ref & State hooks:
    const inputRef = React.useRef(null);
    const [isDefective,setIsDefective] = React.useState(-1);

    const handleBackgroundClick = e => {
        if (e.target === e.currentTarget) {
            onClose();
        };
    }


const saveManualAnnotation_toLS = (defectName, inspectionType) => {

    //!Assert: Check if Manual Annotation variable exists in LS
    let manualAnnotations = getLocalStorageVariable(LS_ANNO);
    if(!manualAnnotations) { setLSObject(LS_ANNO, {}); manualAnnotations = "{}"; }

    //* Now that `LS_ANNO` is set to an Object forsure, parse it:
    let mA = JSON.parse(manualAnnotations);

    let captureStatus = getLocalStorageVariable(LS_ANNO_CAPTURE_STATUS);
    let cS = JSON.parse(captureStatus); //At this point, we know cS["p1"] is forsure registered

    //TODO FIX: DOM HOOK-INS since React State is buggy
    let dS = "";
    if(isDefective) {
        for(const i in DEFECT_LIST) {
            let defect = DEFECT_LIST[i];
            if(defect !== "") {
                if(document.getElementById(defect).checked === true) {
                    dS = defect;
                }
            }
        }
    }
    //TODO FIX: ^^^ Quite Jank

    //Add Manual Annotation Entry:
    mA[defectName] = {
        "p1" : cS["p1"],
        "p1_nrrd" : unNormalizePoints([...cS["p1"]], xDim, yDim, zDim),
        "is_defective" : isDefective,
        "severity" : dS,
        "verts" : cS["verts"]
    }

    if(cS["p2"]) { //! IF ITS A 2. POINT INSPECTION; Register Second Point

    mA[defectName]["p2"] = cS["p2"];
    mA[defectName]["p2_nrrd"] = unNormalizePoints([...cS["p2"]], xDim, yDim, zDim);
    }
    
    setLSObject(LS_ANNO, mA);

    //Now that the Annotation is saved, clear the captureStatus:
    setLSObject(LS_ANNO_CAPTURE_STATUS, cS_RESET);
}

const genDefects = () => {
    let defectList = [];
    for(const i in DEFECT_LIST) {
        let defect = DEFECT_LIST[i];

        if(defect !== "") {
            defectList.push(
                <><input type="radio" value={defect} id={defect}/> {defect} <br/></>
            )
        }
    }
    return defectList;
}

    const render = () => {

        //Check if `p1` and `p2` aren't null

        let captureStatus = getLocalStorageVariable(LS_ANNO_CAPTURE_STATUS);

        if(captureStatus) { //Some kind of status is captured

            let cS = JSON.parse(captureStatus);

        if(cS["verts"]) { //* If Vertices are Registered, Let's proceed with registration

            //* PROMPT To see if Part is Defect or Not:
            if(isDefective < 0) {
                return(
                    <>
                    <span>
                        You're performing a: <b>{cS["p2"] == true ? "2 Point Inspection" : "Single Point Inspection"}</b>
                    </span>
                    <h3>Does your current Selection contain any Defects?</h3>
                    <br/>
                    <button className="blue-button" style={{marginBottom: "2vh", marginLeft: "1vw"}} onClick={() => {setIsDefective(1)}}> YES, It's Defective...</button>
                    <br/>

                    <button className="warning-button" onClick={() => {setIsDefective(0)}}> NO, It's NOT Defective </button>
                    </>
                );
            }  else if(isDefective){   //! COMPONENT IS DEFECTIVE

                return(
                    <>
                    <h3>Defect Severity</h3>
                <div>
                    {genDefects()}
                </div>
                <br/>
                    <div style={{display: 'flex',
                    alignItems: 'center',
                    gap: '10px'}}>
                    
                        <input
                            type="url"
                            ref={inputRef}
                            placeholder="Give this annotation a name..."
                        />

                        <button className="blue-button" onClick={() => {
                            onCloseReload();
                            saveManualAnnotation_toLS(inputRef.current.value);
                            }}>Add Annotation</button>
                </div>
                    </>);
        } else { //& If it's not True, and not under 0, it's definitely the last option; == 0
                return(
                    <>
                        <h4>No Defect..? OK, Please enter name:</h4> <br/>

                        <input
                            type="url"
                            ref={inputRef}
                            placeholder="Give this annotation a name..."
                        />
                        <br/>
                        <button className="blue-button" onClick={() => {
                            onCloseReload();
                            saveManualAnnotation_toLS(inputRef.current.value);
                            }}>Add Annotation</button>
                    </>
                )
            }
        }

        }
        //Nothing happened, so tell the user CS isn't sufficient yet

        return("You haven't captured 2 points yet...");

    }

    return (<div className="modal" onClick={handleBackgroundClick}>
    
            {/* INSIDE THE POP UP: */}
            <div className="modal-content">
    
                <button className="close-button" onClick={onClose}>Close</button>
                <h2>Save Manual Annotation: </h2>
                <hr/>
                {render()}
                  
            </div> {/*ENDOF INSIDE THE POPUP */}
        </div>
      );
}

export default SaveManualAnnotationPopUp