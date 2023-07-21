//React & React Libraries:
import React from 'react'

//React components
import PingServerComp from './PingServerComp';


//Othr local stuff:
import { setLocalStorageVariable, getLocalStorageVariable, getLSvarName } from '../util/handleLS'; //! My own wrapper for LS setter & getter
import { PingServer } from '../util/requests';

const SessionPopUp = ({ onClose }) => {

  const [stateSW,setSSW] = React.useState(0);

  const handleBackgroundClick = e => {
    if (e.target === e.currentTarget) {
        onClose();
    };
  }

  //React State

  const inputRef = React.useRef(null);
  const [gatewayJSX,setGJSX] = React.useState("");

  //CONSTANTS:
  const GATEWAY = getLSvarName();

  const handleGatewaySetBTN = () => {
    // Retrieve the value from the input
    const inputValue = inputRef.current.value;

    setLocalStorageVariable(GATEWAY, inputValue);
    setSSW(1);
  };


  //On Mount, check for current gateway url
  React.useEffect(() =>{

    const gurl = getLocalStorageVariable(GATEWAY);


  //! RENDERING FOR WHEN YOU'RE CONNECTED

    const renderGURL_jsx = (gurl_str) =>{return <>
   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style={{width : "3vw"}}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
</svg>
    <p><span style={{fontWeight : "bold"}}>Currently connected to :</span>   {gurl_str} </p>
      <PingServerComp PingServer={PingServer}/>
    <br/>
    </>}

    setGJSX(gurl ? renderGURL_jsx(gurl) : <div>Ask an Administrator from CTIMS Project for this.</div>);
    
  }, [stateSW])

  return (
    <div className="modal" onClick={handleBackgroundClick}>


        {/* INSIDE THE POP UP: */}
        <div className="modal-content">
            

            <button className="close-button" onClick={onClose}>Close</button>
            <h2 className="pop-up-title">Join a CTIMS Gateway Session</h2>
            {gatewayJSX}
            <br/>
            <div style={{display: 'flex',
      alignItems: 'center',
      gap: '10px'}}>
      
      <input
        type="url"
        ref={inputRef}
        placeholder="Enter your URL here..."
      />

      <button className="blue-button" onClick={handleGatewaySetBTN}>SET Gateway URL</button>
            </div>
        </div>

    </div>
  )
}

export default SessionPopUp
