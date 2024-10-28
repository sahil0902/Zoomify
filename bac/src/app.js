import express from "express";

//to connect both express and socket io server
import {createServer} from "node:http";

import { Server } from "socket.io";
import httpStatus from 'http-status';

import mongoose from "mongoose";

import cors from "cors";
import userRoutes from "./routes/users.routes.js";

import connectToSocket from  "./controllers/socketManager.js"
//init app 
const app = express();
/*
we are using it to connect express to socket's server
*/
const server = createServer(app);
/*
now both express and socket io servers are connected
*/
const io = connectToSocket(server);

//to store port inside the server then we can use it anywhere else by using it's name
app.set("port",(process.env.PORT || 8000));
//to fix cors related issues we can use cors()
app.use(cors());

// Middleware to parse incoming JSON requests with a limit of 40kb
// This ensures that the server can handle JSON payloads up to 40kb in size
app.use(express.json({limit:"40kb"}));

// Middleware to parse incoming URL-encoded data with a limit of 40kb and extended option set to true
// The extended option allows for rich objects and arrays to be encoded into the URL-encoded format
// This ensures that the server can handle URL-encoded payloads up to 40kb in size
app.use(express.urlencoded({limit:"40kb", extended: true}));

///getting users routes 
app.use("/api/v1/users/",userRoutes);
app.get("/home",(req,res)=>{
console.log("at root")
res.send("hello world");
})

const start = async ()=>{
    console.log(httpStatus.OK); 
    const connectionDB = await mongoose.connect("mongodb+srv://muhammadsahil757:shBiJjVhEaWEJ6PE@cluster0.mxzbl08.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log(`connected to db ${connectionDB.connection.host}`);
    server.listen(app.get("port"),()=>{
        console.log("server is running on port 8000");
    })
}


start();