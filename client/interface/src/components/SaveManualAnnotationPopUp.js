import React from 'react'
import { getLocalStorageVariable, setLSObject, LS_ANNO_CAPTURE_STATUS, LS_ANNO } from '../util/handleLS';

const SaveManualAnnotationPopUp = ({onClose, onCloseReload}) => {
    
    //React Ref & State hooks:

    const inputRef = React.useRef(null);
    const [defectSeverity, setDefectSeverity] = React.useState('Severe'); // default value

    const handleBackgroundClick = e => {
        if (e.target === e.currentTarget) {
            onClose();
        };
      }

    const handleDefectSeverityChange = (e) => {
        setDefectSeverity(e.target.value);
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

        //Add Manual Annotation Entry:
        mA[defectName] = {
            "p1" : cS["p1"],
            "p2" : cS["p2"],
            "severity" : defectSeverity
        }

        setLSObject(LS_ANNO, mA);
        
        //Now that the Annotation is saved, clear the captureStatus:

        setLSObject(LS_ANNO_CAPTURE_STATUS, {"p1" : false , "p2" : false});
    }

    const render = () => {

        //Check if `p1` and `p2` aren't null

        let captureStatus = getLocalStorageVariable(LS_ANNO_CAPTURE_STATUS);

        if(captureStatus) { //Some kind of status is captured

            let cS = JSON.parse(captureStatus);

            if(cS["p1"] && cS["p2"]) { //* It's OK! Render the Save Menu:

                return(
                    <>
                                    <h3>Defect Severity</h3>
                <div onChange={handleDefectSeverityChange}>
                    <input type="radio" value="Severe" name="defect" defaultChecked /> Severe <br/>
                    <input type="radio" value="Mild" name="defect" /> Mild <br/>
                    <input type="radio" value="Scratches & Noise" name="defect" /> Scratches & Noise
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
            }
        }
        //Nothing happened, so tell the user CS isn't sufficient yet

        return("You haven't captured 2 points yet...");

    }

    return (
        <div className="modal" onClick={handleBackgroundClick}>
    
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