import React from 'react'
import otuLogo from '../util/otuLogo.png'

const WelcomePopUp = ({onClose}) => {

    const handleBackgroundClick = e => {
        if (e.target === e.currentTarget) {
            onClose();
        };
    }

    return (
        <div className="modal" onClick={handleBackgroundClick}>
            {/* INSIDE THE POP UP: */}
            <div className="modal-content-1">
                <button className="close-button" onClick={onClose}>Close</button>
                <h2>Welcome to CTIMS' Web Interface</h2>

                {/* Flex container for image and paragraph */}
                <div style={{display: 'flex', gap: '20px'}}>
                    {/* Left column (image) */}
                    <div>
                        <img src={otuLogo} height="100px"/>
                    </div>
                    {/* Right column (text) */}
                    <div>

    <div>

        <h3 style={{color : "slategrey"}}>What is this tool all about?</h3>

        <p>
        It's a simplified version of the project's main software application <b>CTIMS GUI App (Python, QT)</b>
        <br/><br/>This web interface seamlessly integrates the advanced Defect Inspection Algorithms found in CTIMS' GUI application, while providing an enhanced level of accessibility and user-friendliness.<br/><br/>
        Watch the <i>"CTIMS Web Interface Tour"</i> video below, to learn more about the Web Interface.
</p>


      <iframe 
        width="560" 
        height="315" 
        src="https://www.youtube.com/embed/9m9ikBBxpYo" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowFullScreen>
      </iframe>
    </div>

                        <p style={{fontSize: "16px"}}> <br/> 
                        This project is under the supervision of <span style={{fontWeight : "bold"}}>Dr. Hossam Gaber </span> & <span style={{fontWeight : "bold"}}>Dr. Chahid Abderrazak </span>  <br/>
                        
                        <br/>

                            For inquires or information, please contact Dr. Gaber at <span style={{fontWeight : "bold"}}>hossam.gaber@ontariotechu.net </span>
                        </p>

                        <div style={{color : "slategrey", textAlign: "center" , fontSize: "12px"}}>
    <p>&copy; 2023 - Ontario Tech University. All rights reserved.</p>
    <p>This project was developed by Jason Manarroo, Undergrad Summer Research Student.</p>
</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WelcomePopUp;
