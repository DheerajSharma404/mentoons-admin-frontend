import UserDashboard from "../../components/taskmanager/UserDashboard"
const TaskManagerDashboard = () => {
  return (
    <div className="flex flex-col h-screen bg-customGray p-10 overflow-hidden pb-10">
      <div className="flex flex-row">
        <UserDashboard />
      </div>
    </div>
  )
}

export default TaskManagerDashboard
