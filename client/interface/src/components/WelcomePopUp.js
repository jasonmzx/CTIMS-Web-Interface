import React from 'react'

//Static Assets:
import otuLogo from '../static/otuLogo.png';
import nvsLogo from '../static/nvsLogo.jpg';
import mitacsLogo from '../static/mitacsLogo.png';

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
                        <img src={nvsLogo} height="100px"/>
                        <img src={mitacsLogo} width="90px"/>
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
                    <h3 style={{color : "slategrey"}}>Industry Partners : New Vision Systems & Mitacs</h3> 
                        <p style={{fontSize: "16px"}}> <br/> 
                        This project is under the supervision of <span style={{fontWeight : "bold"}}>Dr. Hossam A. Gaber</span>. <br/><br/>

                        <span style={{fontWeight: "bold"}}>Developpement Team:</span>
                        <ul>
                            <li><span>Dr. Chahid Abderrazak (Post-Doc Researcher)</span></li>
                            <li><span>Jason Manarroo, Undergrad Summer Research Student</span></li>
                            <li><span>Other researchers at Ontario Tech University which developed Backend Functionalities of CTIMS.</span></li>
                        </ul>


                            For inquires or information, please contact Dr. Gaber at <span style={{fontWeight : "bold"}}>hossam.gaber@ontariotechu.net </span>
                        </p>

                        <div style={{color : "slategrey", textAlign: "center" , fontSize: "12px"}}>
    <p>&copy; 2023 - New Vision Systems. All rights reserved.</p>
</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WelcomePopUp;
