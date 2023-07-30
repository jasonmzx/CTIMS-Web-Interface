import React from 'react'
import { getLocalStorageVariable, setLSObject, LS_ANNO_CAPTURE_STATUS, LS_ANNO } from '../util/handleLS';
import {DEFECT_LIST} from '../util/constant';
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


    const saveManualAnnotation_toLS = (defectName) => {

        //!Assert: Check if Manual Annotation variable exists in LS
        let manualAnnotations = getLocalStorageVariable(LS_ANNO);
        if(!manualAnnotations) { setLSObject(LS_ANNO, {}); manualAnnotations = "{}"; }

        //Now that LS_ANNO is set forsure
        let mA = JSON.parse(manualAnnotations);

        //TODO: Assert, although it should already exist at this point, always...
        let captureStatus = getLocalStorageVariable(LS_ANNO_CAPTURE_STATUS);
        let cS = JSON.parse(captureStatus);

        //Using spread since I want to preserve cS["params"] for later


        //TODO: Call API fill 2 pts 

        //! DOM HOOKINS since React State is buggy
        let dS = "";
        for(const i in DEFECT_LIST) {
            let defect = DEFECT_LIST[i];
            if(document.getElementById(defect).checked === true) {
                dS = defect;
            }
        }

        //Add Manual Annotation Entry:
        mA[defectName] = {
            "p1" : cS["p1"],
            "p1_un" : unNormalizePoints([...cS["p1"]]),
            "p2" : cS["p2"],
            "p2_un" : unNormalizePoints([...cS["p2"]]),
            "severity" : dS
        }

        setLSObject(LS_ANNO, mA);
        
        //Now that the Annotation is saved, clear the captureStatus:

        setLSObject(LS_ANNO_CAPTURE_STATUS, {"p1" : false , "p2" : false});
    }

    const genDefects = () => {
        let defectList = [];
        for(const i in DEFECT_LIST) {
            let defect = DEFECT_LIST[i];

            defectList.push(
                <><input type="radio" value={defect} id={defect}/> {defect} <br/></>
            )
        }
        return defectList;
    }

    const render = () => {

        //Check if `p1` and `p2` aren't null

        let captureStatus = getLocalStorageVariable(LS_ANNO_CAPTURE_STATUS);

        if(captureStatus) { //Some kind of status is captured

            let cS = JSON.parse(captureStatus);

            if(cS["p1"] && cS["p2"]) { //* It's OK! Render the Save Menu:

            //* PROMPT To see if Part is Defect or Not:
            if(isDefective < 0) {
                return(
                    <>
                    <h3>Does your current Selection contain any defective behavior?</h3>
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