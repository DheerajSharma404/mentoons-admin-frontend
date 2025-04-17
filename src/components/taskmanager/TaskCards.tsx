import { ITaskCards } from "../../types/index"
import { getInitials } from "../../utils/getInitials"
import classNames from 'classnames';
import { FaExclamationCircle } from 'react-icons/fa';

export const renderAssignees = (assignees: string[]) => {
    const colors = ['#283618', '#606C38', '#DDA15E','#BC6C25'] 
    return (
        <div className="flex flex-row -space-x-2">
            {
                assignees.map((item: string, index: number) => {
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    return (
                        <h3 key={index} className={classNames('text-md font-bold text-white rounded-full w-10 h-10 flex items-center justify-center')} style={{ backgroundColor: color }}>
                            {getInitials(item)}
                        </h3>
                    );
                })
            }
        </div>
    );
}

const TaskCards: React.FC<ITaskCards> = ({ priority, task, projectname, status, dueDate, assignee, totalMembers }) => {
    return (
        <div>
            <div className="flex flex-col space-y-2bg-white shadow-md rounded-md p-6 space-y-4">
                <div className="flex flex-row items-center justify-between w-full">
                <h3 className={`text-sm font-bold flex items-center ${priority === 'High' ? 'text-red-500' : priority === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`}>
                    <FaExclamationCircle className="mr-2" />
                    {priority}
                </h3>
                <h3 className="text-md font-semibold text-black">{dueDate}</h3>
                </div>
              <div className="flex flex-row items-center justify-between w-full">
                <h3 className="text-md font-bold text-black">{task}</h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                      status === 'To Do' ? 'bg-yellow-500' :
                      status === 'In Progress' ? 'bg-blue-500' :
                      status === 'Done' ? 'bg-green-500' : 'bg-gray-500'
                    }`}></div>
                  <span className="text-sm text-gray-600">{status}</span>
                </div>
              </div>
                <h3 className="text-xl text-accentText">{projectname}</h3>
                <div className="flex flex-row items-center justify-between w-full mt-2">
                <div>
                    {renderAssignees(assignee)}
                </div>
                <h3>{assignee.length}/{totalMembers}</h3>
                </div>
            </div>
        </div>
    )
}

export default TaskCards
