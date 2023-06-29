import React from 'react'
import TimeCounter from './TimeCounter';
import { getLSvarName, getLocalStorageVariable } from '../util/handleLS';

const InspectionReqPopUp = ({onClose, refBlob, inpBlob, postCallback}) => {

    //React Constants & States:
    const [start, setStart] = React.useState(false);
    const [postResp, setPostResp] = React.useState(null);

    const gatewayValue = getLocalStorageVariable(getLSvarName())

    const handleBackgroundClick = e => {
        if (e.target === e.currentTarget) {
            onClose();
        };
    }  


    const PostUI_Handle = async () => {
        let res = await postCallback();

        console.log(typeof res);
        console.log(res);
        if(typeof res === "string") { //! Indication of Error
        setPostResp( 
              <>
                <h3>[ CTIMS-Web-Interface Request ERROR ]</h3>
                <p>{res}</p>
              </>
        );
        return;
        }
        
        if(typeof res === "number") {
            setPostResp( 
                <>
                  <h3>[ CTIMS-Web-Interface Success ] {res}</h3>
                </>
          );

          onClose();
        }
        
    }

    const genPostButton = () => {

        //If all Requirements aren't NULL or False, allow use to make request
        if(refBlob && inpBlob && gatewayValue) {
            return <button className="blue-button" onClick={() => {
            
            //Trigger POST Callback, and set Post Response to a Loading state

            const loader = <>
                    <div class="loader" ></div>
                    <h4>The gateway is processing your request...</h4>
                    <TimeCounter start={true}/>
                </>;

                PostUI_Handle();
                setPostResp(loader);
            }}>
                POST Inspection Request to Gateway
            </button>
        }
    }



   const inspectionRender = (state) => {
    
    if(!state) {
    return <> <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style={{width : "25px"}}>
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>

        <span><b>Demo Session Gateway:</b> {gatewayValue ? gatewayValue : <><br/>❌ You aren't connected to a Demo Session, go to <b style={{color : "darkblue"}}>Join Session</b> and connect to a gateway...</>}</span>
    </div>

    <br/>
    {/* Reference Volume Message */}

    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style={{width : "25px"}}>
        <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
        </svg>

        <span><b>Reference:</b> {refBlob ? ".NRRD File loaded!" : "❌ No Reference Volume loaded..."}</span>
    </div>

    <br/>
    {/* Input Volume Message */}

    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style={{width : "25px"}}>
        <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
        </svg>

        <span><b>Input:</b> {inpBlob ? ".NRRD File loaded!" : "❌ No Reference Volume loaded..."}</span>
    </div>

    <br/>
    {genPostButton()}
    <br/></>;
    } 

    //If state isn't False or NULL, just return it
    return state;
    }     


    return (<div className="modal" onClick={handleBackgroundClick}>
    
    
    
            {/* INSIDE THE POP UP: */}
            <div className="modal-content">
            <button className="close-button" onClick={onClose}>Close</button>
            <h2 style={{color : 'darkslategray'}}>Inspection Request: </h2>
                {inspectionRender(postResp)}
            </div>
    
    </div>);
}

export default InspectionReqPopUp