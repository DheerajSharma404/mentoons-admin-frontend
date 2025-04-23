import React from "react";
import { FaExclamationCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Timer from "../components/common/Timer";
import { renderAssignees } from "../components/taskmanager/TaskCards";
import { ITaskCards } from "../types";
import { taskConst } from "../utils/constants";

const TaskDetail: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const task = taskConst.find((task: ITaskCards) => task.id === taskId);

  if (!task) {
    return <div>Task not found</div>;
  }

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">{task.task}</h1>
      <Timer />
      <div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <h2 className="text-xl font-semibold">Priority</h2>
            <h3
              className={`text-sm font-bold flex items-center ${
                task.priority === "High"
                  ? "text-red-500"
                  : task.priority === "Medium"
                  ? "text-yellow-500"
                  : "text-green-500"
              }`}
            >
              <FaExclamationCircle className="mr-2" />
              {task.priority}
            </h3>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Status</h2>
            <div className="flex flex-row items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  task.status === "To Do"
                    ? "bg-yellow-500"
                    : task.status === "In Progress"
                    ? "bg-blue-500"
                    : task.status === "Done"
                    ? "bg-green-500"
                    : "bg-gray-500"
                }`}
              ></div>
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
        <h2 className="mb-2 text-xl font-semibold">Description</h2>
        <textarea
          className="w-full p-2 border rounded-lg resize-none"
          rows={4}
          placeholder="Enter your description"
        ></textarea>
      </div>
      <div className="mt-4">
        <h2 className="mb-2 text-xl font-semibold">Git Commit</h2>
        <textarea
          className="w-full p-2 border rounded-lg resize-none"
          rows={2}
          placeholder="Enter your commit message"
        ></textarea>
      </div>
      <button className="px-4 py-2 mt-4 text-white bg-blue-500 rounded">
        Submit
      </button>
    </div>
  );
};

export default TaskDetail;
