import React from 'react'

const DefectRegistrationPopUp = ({onClose, onCloseReload, handleBackgroundClick}) => {
  return (
    <div className="modal" onClick={handleBackgroundClick}>
    
    
    {/* INSIDE THE POP UP: */}
    <div className="modal-content">
        

        <button className="close-button" onClick={onClose}>Close</button>
        <h2>Register Defect...</h2>
        <br/>
            <div style={{display: 'flex',
            alignItems: 'center',
            gap: '10px'}}>
            

            </div>  
    </div> {/*ENDOF INSIDE THE POPUP */}
</div>
  )
}

export default DefectRegistrationPopUp