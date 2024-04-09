import axios from "axios";
import { Button } from "@/components/ui/button"
import { EllipsisVertical, Mic, Search, Send, Smile } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { useEffect, useMemo, useRef, useState } from "react";
import { io } from 'socket.io-client';
  

export const Home = () => {

    const APIURL = 'http://localhost:3000';
    const scrollRef = useRef(null);
    const user = localStorage.getItem('user');
    const userid:any = user ? JSON.parse(user).id : null;
    const username = user ? JSON.parse(user).username : null;

    const socket:any = useMemo(()=>
        io(APIURL,{
            extraHeaders:{
                userid: userid
            }
        }),[]
    );

    const [msg,setMsg] = useState('');
    const [users,setUsers] = useState([]);
    const [selectedUser,setSelecteduser] = useState({
        id:'',
        username:'',
        email:''
    });
    const [chats,setChats] = useState([]);
    const [activeUsers,setActiveusers] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            axios.get(APIURL+'/auth/users')
            .then((res)=>{
                if(res.data){
                    setUsers(res.data.users);
                }
            })
        }
        getUsers();
        function onConnect() {
          console.log("connect");
        }
        function onDisconnect() {
            console.log("disconnect");
        }
        function onMsg(value:any) {
            console.log(value);
            setChats((chats) => [...chats,value] as any);
        }
        function onUser(value:any) {
            console.log(value);
            setActiveusers(value);
            // set active users
        }
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('MSG', onMsg);
        socket.on('USERS', onUser);
        return () => {
          socket.disconnect();
        };
      }, []);

    // const users = [
    //     {"name":"Jane Doe","email":"jane@mail.com"},
    //     {"name":"John Doe","email":"john@mail.com"},
    //     {"name":"Kane Doe","email":"kane@mail.com"},
    //     {"name":"Angela Doe","email":"Angela@mail.com"}
    // ];

    const conversation = [
        {"id":"Jane","msg":"Hey Angela? Is it you?","createdon":"12-08-2023"},
        {"id":"Angela","msg":"Oh Jane! How are you? It’s been a long time.","createdon":"12-08-2023"},
        {"id":"Jane","msg":"I am fine, what about you? Yes, we last met during the board exams.","createdon":"12-08-2023"},
        {"id":"Angela","msg":"I’m good too.","createdon":"12-08-2023"},
        {"id":"Jane","msg":"What are you doing now?","createdon":"12-08-2023"},
        {"id":"Angela","msg":"Well, I have started my undergraduate studies in English Honours.","createdon":"12-08-2023"},
        {"id":"Jane","msg":"Wow! You finally got to study the subject you loved the most in school.","createdon":"12-08-2023"},
        {"id":"Angela","msg":"Thanks","createdon":"12-08-2023"},
    ];

    const scrollTO = () => {
        // @ts-ignore
        scrollRef.current?.lastElementChild?.scrollIntoView();
    }

    useEffect(()=>{
            scrollTO();   
    },[]);

    const sendMsg = () => {
        if(msg == '') return;
        const data = {
            "message":msg,
            "receiver":''+selectedUser.id,
            "sender":''+userid,
            "createdon": (new Date()).toISOString()
        }
        socket.emit("SENDMSG",data);
        setChats((chats) => [...chats,data] as any);
        setMsg('');
    }

    const getChats = async (id:number) => {
        axios.post(APIURL+'/chats',{
            sender: userid,
            receiver: id
        })
        .then((res)=>{
            if(res.data){
                setChats(res.data.chats);
            }
        })
    }

    const selectUser = (x:any) => {
        setSelecteduser(x);
        getChats(x.id)
    }
    

    
    const verify = () => {
        axios.get(APIURL+'/auth/verify')
        .then((res)=>{
            if(res.data){
                console.log(res.data);
            }
        })
    }
    return <div className="dark:text-white flex flex-col items-center justify-center w-full md:w-[80%]">
        <div className="wrapper w-full flex h-[500px]">
            <div className="left border w-[280px] p-2 rounded">
            <p>{username}</p>
            <div className="relative mb-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                type="search"
                placeholder="Search..."
                className="pl-8"
                />
            </div>

            {users.length > 0 && users.map((x:any,i)=>{
                if(x.id == userid) return null;
                return <div onClick={()=>selectUser(x)} key={i} className="flex items-center justify-between px-2 py-1 border mb-2 rounded cursor-pointer hover:bg-slate-600">
                <div className="user px-1 flex justify-start items-center">
                    
                    {/* @ts-ignore */}
                    {!activeUsers.includes((x.id).toString()) ? <span className="rounded-full w-3 h-3 bg-gray-500"></span> : <span className="rounded-full w-3 h-3 bg-green-500"></span>}
                    
                    <Avatar className="mx-1">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
                <div>
                    <p>{x.username}</p>
                    <p className="truncate w-[120px] text-sm">{x.email}</p>
                </div>
                <div className="w-12 flex flex-col items-end">
                    <p className="text-[10px] italic">11:10 PM</p>
                </div>
            </div>
            })}
            
            </div>
            {!selectedUser.id && <div className="right relative w-full ml-2 rounded flex flex-col">
                <div className="h-full border flex items-center justify-center">
                <p>Please select a user to start chat !</p>
                </div>
            </div>}
            {selectedUser.id && <div className="right relative w-full ml-2 rounded flex flex-col">
                <div className="border p-2 flex items-center justify-between rounded">
                    <div className="flex">
                        <Avatar className="mx-2 w-[50px] h-[50px]">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col justify-center">
                            <h2 className="text-xl">{selectedUser.username}</h2>
                            <p className="text-sm">{selectedUser.email}</p>
                        </div>
                    </div>
                    <div className="dark">
                    <DropdownMenu>
                        <DropdownMenuTrigger><EllipsisVertical /></DropdownMenuTrigger>
                        <DropdownMenuContent className="dark">
                            <DropdownMenuItem>Clear Chat</DropdownMenuItem>
                            <DropdownMenuItem>Menu Item 1</DropdownMenuItem>
                            <DropdownMenuItem>Menu Item 1</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </div>
                </div>
                <div ref={scrollRef} className="border h-full overflow-y-auto p-2 rounded my-1">
                    {/* {JSON.stringify(chats)} */}
                    {chats.length > 0 && chats.map((x:any,i)=>{
                      return  <div>
                    
                    {x.receiver == selectedUser.id && <div className="sent my-2 flex justify-end">
                        <p className="bg-slate-500 max-w-[60%] px-3 py-2 rounded-lg">{x.message}</p>
                    </div>}
                    
                    {x.receiver == userid && <div className="received my-2 flex justify-start">
                        <p className="bg-green-500 max-w-[60%] px-3 py-2 rounded-lg">{x.message}</p>
                    </div>}
                    
                    </div>
                    })}

                </div>
                <div className="w-full flex">
                    <div className="relative flex w-full">
                        <Input
                        value={msg}
                        onChange={(e)=> setMsg(e.target.value)} 
                        type="text"
                        placeholder="Type message here..."
                        className=""
                        />
                        <Button className="absolute right-0 w-[56px] bg-transparent"><Mic></Mic></Button>
                        <Button className="absolute right-[56px] w-[56px] bg-transparent"><Smile></Smile></Button>

                    </div>
                    <Button onClick={sendMsg} className="bg-slate-200"><Send></Send></Button>
                </div>
            </div>}
        </div>
    </div>
};