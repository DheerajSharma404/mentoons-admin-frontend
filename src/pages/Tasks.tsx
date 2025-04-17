import TaskCards from "../components/taskmanager/TaskCards"
import { ITaskCards } from "../types"
import { taskConst } from "../utils/constants"
import { Link } from 'react-router-dom';

const Tasks : React.FC = () => {
    return (
       <div className="flex flex-col">
       <h1 className="text-2xl font-bold w-full my-4">My Tasks</h1>
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-10 w-full mx-auto`}>
            {
                taskConst.map((task: ITaskCards, index: number) => (
                    <Link to={`/task/${task.id}`} key={index}>
                        <TaskCards {...task} />
                    </Link>
                ))
            }
        </div>

       </div>
    )
}

export default Tasks
