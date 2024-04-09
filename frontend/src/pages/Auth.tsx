import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/authProvider"

export const Auth = () => {

    const APIURL = 'http://localhost:3000';

    const navigate = useNavigate();

    const {setToken}:any = useAuth();

    const blankUser = {
        email:'',
        password:''
    }

    const blankSignuser = {
        username:'',
        email:'',
        password:'',
        confirmpass:''
    }

    const [user,setUser] = useState(blankUser);

    const [signuser,setSignuser] = useState(blankSignuser);

    const login = () => {
        axios.post(APIURL+'/auth/login', {
            email: user.email,
            password: user.password
          })
          .then(function (response) {
            if(response.data.token){
                setToken(response.data.token);
                localStorage.setItem('user',JSON.stringify(response.data.user));
                navigate('/');
            }
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
        });
    }

    const signup = () => {
        axios.post(APIURL+'/auth/signup', {
            username: signuser.username,
            email: signuser.email,
            password: signuser.password
          })
          .then(function (response) {
            if(response.data){
                // console.log(response.data);
                alert(response.data.message);
                setSignuser(blankSignuser)
            }
          })
          .catch(function (error) {
            console.log(error);
        });
    }
    return <div className="dark:text-white grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col items-center justify-start md:pt-[100px]">
            <img className="w-[100px]" src="https://static.vecteezy.com/system/resources/previews/014/441/080/original/chat-icon-design-in-blue-circle-png.png" alt="" />
            <h1 className="text-3xl py-2">Chat App</h1>
            <p className="text-extralight py-1 text-xl">Simple, Personal, Real time chat app.</p>
        </div>
        <div className="">
        <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Signup</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
            <Card>
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                Enter Email and Password to login.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input value={user.email} onChange={(e) => setUser({...user,email:e.target.value}) } id="email" placeholder="john@mail.com" />
                </div>
                <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input type="password" value={user.password} onChange={(e) => setUser({...user,password:e.target.value})} id="password" placeholder="******" />
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={login}>Login</Button>
            </CardFooter>
            </Card>
        </TabsContent>
        <TabsContent value="signup">
            <Card>
            <CardHeader>
                <CardTitle>Signup</CardTitle>
                <CardDescription>
                Enter below fields to signup.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input value={signuser.username} onChange={(e) => setSignuser({...signuser,username:e.target.value})} id="username" placeholder="John Doe" />
                </div>
                <div className="space-y-1">
                <Label htmlFor="email_">Email</Label>
                <Input value={signuser.email} onChange={(e) => setSignuser({...signuser,email:e.target.value})} id="email_" placeholder="john@mail.com" />
                </div>
                <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input value={signuser.password} onChange={(e) => setSignuser({...signuser,password:e.target.value})} id="password" placeholder="******" />
                </div>
                <div className="space-y-1">
                <Label htmlFor="confirm_password">Confirm Password</Label>
                <Input value={signuser.confirmpass} onChange={(e) => setSignuser({...signuser,confirmpass:e.target.value})} id="confirm_password" placeholder="******" />
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={signup}>Signup</Button>
            </CardFooter>
            </Card>
        </TabsContent>
        </Tabs>
        </div>
    </div>
};