import React from 'react';
import { useParams } from 'react-router-dom';
import { taskConst } from '../utils/constants';
import { ITaskCards } from '../types';
import Timer from '../components/common/Timer';
import { FaExclamationCircle } from 'react-icons/fa';
import { renderAssignees } from '../components/taskmanager/TaskCards';

const TaskDetail: React.FC = () => {
    const { taskId } = useParams<{ taskId: string }>();
    const task = taskConst.find((task: ITaskCards) => task.id === taskId)

    if (!task) {
        return <div>Task not found</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{task.task}</h1>
            <Timer />
            <div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <h2 className="text-xl font-semibold">Priority</h2>
                        <h3 className={`text-sm font-bold flex items-center ${task.priority === 'High' ? 'text-red-500' : task.priority === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`}>
                    <FaExclamationCircle className="mr-2" />
                    {task.priority}
                </h3>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">Status</h2>
                        <div className='flex flex-row items-center space-x-2'>
                            <div className={`w-3 h-3 rounded-full ${task.status === 'To Do' ? 'bg-yellow-500' :
                                    task.status === 'In Progress' ? 'bg-blue-500' :
                                        task.status === 'Done' ? 'bg-green-500' : 'bg-gray-500'
                                }`}></div>
                            <p className="mt-1">{task.status}</p>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">Assignee</h2>
                        <p className="mt-1">{renderAssignees(task.assignee)}</p>   
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">Project Name</h2>
                        <p className="mt-1">{task.projectname}</p>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <textarea className="w-full p-2 border rounded-lg resize-none" rows={4} placeholder='Enter your description'></textarea>
            </div>
            <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">Git Commit</h2>
                <textarea className="w-full p-2 border rounded-lg resize-none" rows={2} placeholder="Enter your commit message"></textarea>
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4">Submit</button>
        </div>
    );
};

export default TaskDetail;
