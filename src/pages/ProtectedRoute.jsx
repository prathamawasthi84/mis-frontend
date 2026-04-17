import { Navigate, useLocation, useNavigate } from "react-router-dom";
function ProtectedRoute({children,requiredRole}){
    const token = localStorage.getItem('token');
    const location = useLocation();
    if(!token){
        return <Navigate to={'/login'} state={{from : location}} replace/> 
    }
    if(requiredRole){
        const decoded = jwtDecode(token);
        if(decoded.role!== requiredRole){
            return <Navigate to="/dashboard" replace/>
        }
    }
    return children;
}
export default ProtectedRoute;