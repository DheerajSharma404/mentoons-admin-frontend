import { useState, useEffect } from "react";
import UserDashboardCards from "./UserDashboardCards";

const UserDashboard = () => {
    const [timer, setTimer] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!isRunning && timer > 0) {
            logTimeToBackend(timer);
        }
    }, [isRunning]);

    const startTimer = () => {
        if (!isRunning) {
            const id = setInterval(() => {
                setTimer(prevTimer => prevTimer + 1);
            }, 1000);
            setIntervalId(id);
            setIsRunning(true);
        }
    };

    const stopTimer = () => {
        if (isRunning && intervalId) {
            clearInterval(intervalId);
            setIsRunning(false);
        }
    };

    const logTimeToBackend = async (time: number) => {
        try {
            const hoursWorked = (time / 3600).toFixed(2);
            console.log(`Hours worked: ${hoursWorked}`);
        } catch (error) {
            console.error("Error logging time to backend:", error);
        }
    };

    const formatTime = (time: number) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;
        return `${hours}h ${minutes}m ${seconds}s`;
    };

    return (
        <div className="w-full">
            <div className="flex flex-row justify-between mt-10">
                <h1 className="text-2xl font-bold">Welcome, User</h1>
                <div className="flex flex-row items-center space-x-4">
                    <p className={`text-MD font-bold ${isRunning ? 'text-red-500' : 'text-blue-500'}`}>{formatTime(timer)}</p>
                <button
                    className={`text-white font-bold py-1 px-3 rounded-full ${
                        isRunning
                            ? "bg-red-500 hover:bg-red-700"
                            : "bg-blue-500 hover:bg-blue-700"
                    }`}
                    onClick={isRunning ? stopTimer : startTimer}
                >
                    {isRunning ? "Stop Timer" : "Start Timer"}
                </button>
                </div>
            </div>
            <div>
                <UserDashboardCards />      
            </div>
        </div>
    );
};

export default UserDashboard;