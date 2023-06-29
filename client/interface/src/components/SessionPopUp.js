import React from 'react'

const SessionPopUp = ({ onClose }) => {
  const handleBackgroundClick = e => {
    if (e.target === e.currentTarget) {
        console.log("BG CLICK?");
        onClose();
    };
  }

  //react 

  const inputRef = React.useRef(null);
  const [gatewayURL,setgUrl] = React.useState("");

  //CONSTANTS:
  const gatewayLSname = "gateway";


  const handleClick = () => {
    // Retrieve the value from the input
    const inputValue = inputRef.current.value;

    setLocalStorageVariable(gatewayLSname, inputValue);
  };


  const checkForLocalStorageVariable = (variableName) => {
    // Check if the variable exists in localStorage
    if (localStorage.getItem(variableName)) {
      // If the variable exists, return its value
      return localStorage.getItem(variableName);
    } else {
      // If the variable does not exist, return null
      return null;
    }
  }
  
  const setLocalStorageVariable = (variableName, value) => {
    // Set the value of the variable in localStorage
    localStorage.setItem(variableName, value);
    // If the value was set successfully, return true
    return localStorage.getItem(variableName) === value;
  }

  //On Mount, check for current gateway url
  React.useEffect(() =>{

    const gurl = checkForLocalStorageVariable(gatewayLSname);


    const gurlJSX = (gurl_str) =>{return <>

    <p><span style={{fontWeight : "bold"}}>Currently connected to :</span>   {gurl_str} </p>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style={{width : "3vw"}}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
</svg>

    <br/>
    </>}

    setgUrl(gurl ? gurlJSX(gurl) : "");
    
  }, [])

  return (
    <div className="modal" onClick={handleBackgroundClick}>


        {/* INSIDE THE POP UP: */}
        <div className="modal-content">
            

            <button className="close-button" onClick={onClose}>Close</button>
            <h2>Join a CTIMS Gateway Session</h2>
            {gatewayURL}
            <div>Ask an Administrator from CTIMS Project for this.</div>
            <br/>
            <div style={{display: 'flex',
      alignItems: 'center',
      gap: '10px'}}>
      <input
        type="url"
        ref={inputRef}
        placeholder="Enter your URL here..."

      />
      <button className="blue-button" onClick={handleClick}>SET GATEWAY</button>
            </div>
        </div>

    </div>
  )
}

export default SessionPopUp
