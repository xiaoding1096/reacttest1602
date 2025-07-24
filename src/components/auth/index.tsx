import { useLocale } from "antd/es/locale"
import { useCurrentApp } from "../context/app.context"
import { useLocation } from "react-router-dom"


interface IProps {
    children: React.ReactNode
}

 const ProtectedRoute = (props: IProps) => {
    const {user, isAuthenticated} = useCurrentApp()
    const location = useLocation()
    const isAdminRoute = location.pathname
    if(isAuthenticated === false){
        return (
                <div>
                    "You need login to access this page"
                </div>
            )
    }

        
    if(isAuthenticated && isAdminRoute){
        const role = user?.role
        if(role === "USER"){
            console.log("ok")
            return (
                <div>
                    
                    "You are not authorized to access this page"
                </div>
            )
        }
    }
    return (
        props.children
    )
 }
 export default ProtectedRoute