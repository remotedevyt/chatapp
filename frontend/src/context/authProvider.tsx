import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
const AuthContext = createContext({});

const AuthProvider = ({children}:any) => {
    const [token,setToken] = useState(localStorage.getItem("token"));
    useEffect(()=>{
        if(token){
            axios.defaults.headers.common['Authorization'] = "Bearer "+token;
            localStorage.setItem("token",token);
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
    },[token]);

    const contextValue = {
        token,setToken
    }

    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
}

export default AuthProvider;

