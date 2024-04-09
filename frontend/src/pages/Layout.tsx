import { useAuth } from "@/context/authProvider";
import axios from "axios";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export const Layout = () => {
    const { token,setToken }:any = useAuth();
    const navigate = useNavigate()

    axios.interceptors.response.use(function (response) {
        return response;
      }, function (error) {
        if(error.response.status == 403){
            setToken('');
            navigate('/auth');
        }
        return Promise.reject(error);
    });

    useEffect(()=>{
        if(!token){
            navigate('/auth')
        } else {
            navigate('/')
        }
    },[]);

    return <div className="dark bg-background flex items-start justify-center h-full min-h-screen py-[70px]">
        <Outlet />
    </div>
};