import React from 'react';

const PingServerComp = ({PingServer}) => {
    const [ping, setPing] = React.useState(null);

    const handleRefresh = () => {
      setPing(null);
      PingServer().then(response => {
        setPing(response);
      });
    }

    React.useEffect(() => {
      handleRefresh();
    }, []); // Empty array as the second argument ensures this effect runs only once after the component mounts
  
    return (
      <>
        {ping === null && <><p>Loading...</p></>}
        {ping?.message && <><p>✔️ {ping.message}</p></>}
        {ping?.error && <><p>❌ Couldn't connect to gateway...</p></>}
        <button className="refresh_button" onClick={handleRefresh}>Refresh ↻</button>
      </>
    )
}

export default PingServerComp;
