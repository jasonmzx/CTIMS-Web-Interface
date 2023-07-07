import React from 'react'

import { addKeyToCoordsObject } from '../util/handleLS';


const SaveCoordsPopUp = ({onClose, intArr}) => {
    
    const inputRef = React.useRef(null);

    const handleBackgroundClick = e => {
        if (e.target === e.currentTarget) {
            onClose();
        };
      }

    return (
        <div className="modal" onClick={handleBackgroundClick}>
    
    
            {/* INSIDE THE POP UP: */}
            <div className="modal-content">
                
    
                <button className="close-button" onClick={onClose}>Close</button>
                <h2>Save Coords: </h2>
                <br/>
                    <div style={{display: 'flex',
                    alignItems: 'center',
                    gap: '10px'}}>
                    
                        <input
                            type="url"
                            ref={inputRef}
                            placeholder="Give these points of interest a name..."
                        />

                        <button className="blue-button" onClick={() => {
                            addKeyToCoordsObject(inputRef.current.value, intArr);
                            onClose();
                            }}>SET Defect Name</button>
                    </div>  
            </div> {/*ENDOF INSIDE THE POPUP */}
        </div>
      );
}

export default SaveCoordsPopUp