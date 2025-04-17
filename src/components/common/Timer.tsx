import React, { useState, useEffect } from 'react';

const Timer: React.FC = () => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval!);
    }
    return () => clearInterval(interval!);
  }, [isActive, time]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handleStop = () => {
    setIsActive(false);
  };

  return (
    <div className='flex flex-col justify-between'>
      <div className='text-2xl font-mono text-gray-800 mb-8'>{new Date(time * 1000).toISOString().substr(11, 8)}</div>
      <div>
        <button 
          onClick={handleStart} 
          className="bg-green-500 text-white px-4 py-2 rounded transition duration-300 ease-in-out transform hover:scale-105 hover:bg-green-600"
        >
          Start
        </button>
        <button 
          onClick={handleStop} 
          className="bg-red-500 text-white px-4 py-2 rounded ml-2 transition duration-300 ease-in-out transform hover:scale-105 hover:bg-red-600"
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default Timer;
