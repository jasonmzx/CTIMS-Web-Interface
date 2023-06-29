import React, { useState, useEffect, useRef } from 'react';

const TimeCounter = ({ start }) => {
  const [time, setTime] = useState(0);
  const intervalRef = useRef(null);

  const formatTime = (time) => {
    const getMilliseconds = (time) => ("00" + (time % 1000)).slice(-3);
    const getSeconds = (time) => ("0" + (Math.floor(time / 1000) % 60)).slice(-2);
    const getMinutes = (time) => ("0" + (Math.floor(time / 60000) % 60)).slice(-2);

    return `${getMinutes(time)} : ${getSeconds(time)} : ${getMilliseconds(time)}`;
  };

  useEffect(() => {
    if (start) {
      const startTime = Date.now() - time;
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 1);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [start]);

  return (
    <div>
      <h1>{formatTime(time)}</h1>
    </div>
  );
};

export default TimeCounter;
