import React from 'react'

const WelcomePopUp = ({onClose}) => {

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
                <h2>Welcome to CTIMS' Web Interface</h2>
                <br/>
                <div style={{display: 'flex',
          alignItems: 'center',
          gap: '10px'}}>
          

    
                </div>
            </div>
    
        </div>
      );
}

export default WelcomePopUp