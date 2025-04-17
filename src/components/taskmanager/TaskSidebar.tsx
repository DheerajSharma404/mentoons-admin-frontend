import { NavLink } from "react-router-dom"
import { navLinkUserConst } from "../../utils/constants"
import { INavLinkUser } from "../../types"
import { FaUser } from "react-icons/fa"

const TaskSidebar = () => {
  return (
    <div className="p-4 w-full">
      <div className="flex flex-col space-y-4">
        <h2 className="text-xl font-bold text-black flex items-center space-x-4"><FaUser className="mr-2"/>Employee Management</h2>
        {navLinkUserConst.map((link: INavLinkUser,index:number) => (
          <NavLink to={link.path} key={index}>
            <h1 className="text-md font-semibold text-[#8a8a8a] hover:text-black ml-8 ">{link.name}</h1>
          </NavLink>
        ))}
        <hr className="border-1 border-[#c1c1c1]" />
      </div>
    </div>
  )
}

export default TaskSidebar
