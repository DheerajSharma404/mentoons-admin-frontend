import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({children}:{children:React.ReactNode}) => {
    const { user } = useUser();
    console.log(user,'user')
    if(!user){
        return <Navigate to="/sign-in" />
    }
    return children;
}

export default ProtectedRoutes
