import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const TaskStatistics = () => {
    const [taskData, setTaskData] = useState<any[]>([]);

    useEffect(() => {
        // Define task data statically
        const data = [
            { date: '2023-01-01', tasks: 5, completed: 3, value: 10, name: 'Task A' },
            { date: '2023-01-02', tasks: 8, completed: 6, value: 20, name: 'Task B' },
            { date: '2023-01-03', tasks: 2, completed: 2, value: 30, name: 'Task C' },
            { date: '2023-01-04', tasks: 7, completed: 5, value: 40, name: 'Task D' },
            { date: '2023-01-05', tasks: 6, completed: 4, value: 50, name: 'Task E' },
            { date: '2023-01-06', tasks: 9, completed: 7, value: 60, name: 'Task F' },
            { date: '2023-01-07', tasks: 3, completed: 3, value: 70, name: 'Task G' },
            { date: '2023-01-08', tasks: 4, completed: 2, value: 80, name: 'Task H' },
            // Add more data as needed
        ];
        setTaskData(data);
    }, []);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="flex flex-col h-screen p-6 w-full">
            <h1 className="text-3xl font-bold mb-6">Task Statistics</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4">
                    <h2 className="text-2xl font-bold mb-4">Tasks Over Time</h2>
                    <LineChart width={500} height={300} data={taskData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" /> 
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="tasks" stroke="#8884d8" />
                    </LineChart>
                </div>
                <div className="p-4">
                    <h2 className="text-2xl font-bold mb-4">Task Completion</h2>
                    <BarChart width={500} height={300} data={taskData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="completed" fill="#82ca9d" />
                    </BarChart>
                </div>
                <div className="p-4">
                    <h2 className="text-2xl font-bold mb-4">Task Distribution</h2>
                    <PieChart width={400} height={400}>
                        <Pie
                            data={taskData}
                            cx={200}
                            cy={200}
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {taskData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </div>
                <div className="p-4">
                    <h2 className="text-2xl font-bold mb-4">Additional Chart</h2>
                    {/* Add another chart or content here */}
                </div>
            </div>
        </div>
    );
};

export default TaskStatistics;
