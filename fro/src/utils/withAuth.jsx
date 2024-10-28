import { useEffect } from "react";
import { useNavigate } from "react-router-dom"

const withAuth = (wrappedComponent) =>{
    const AuthCompinent = (props) =>{
        const router = useNavigate();

        const isAuthenticated = () =>{
            const token = localStorage.getItem('token');
            if(!token){
                router('/auth');
            }
        }
        useEffect(() =>{
            if(!isAuthenticated()){
                router('/auth');
            }
        },[])
        return <wrappedComponent {...props}/>
    }
    return AuthCompinent;
}
export default withAuth;