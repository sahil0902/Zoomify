import httpStatus from "http-status";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs"; // Updated import
import crypto from "crypto";
import { Meeting } from "../models/meeting.model.js";


//register 
const register = async (req, res) => {
    const { name, username, password } = req.body;
    console.log(req.body);
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(httpStatus.CONFLICT).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name: name,
            username: username,
            password: hashedPassword
        });
        // Saving new user in db
        await newUser.save();

        // Generate a token for the new user
        const token = crypto.randomBytes(20).toString("hex");
        newUser.token = token; // Store the token in the user document
        await newUser.save(); // Save the user again to include the token

        res.status(httpStatus.CREATED).json({ token: token, message: "User Registered" });
    } catch (error) {
        console.log(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error registering user" });
    }
};

//login controller 

const login = async (req,res)=>
{
    const {username,password} = req.body;
    if (!username || !password){
        return res.status(httpStatus.BAD_REQUEST).json({message : "Please enter both username and password"});
    }
    
    try{
        const user = await User.findOne({username});
        if(!user){
            return res.status(httpStatus.NOT_FOUND).json({message:"User not found"});
        }
        // const isPasswordValid = await bcrypt.compare(password, user.password);

        // console.log("Password:", password);
        // console.log("Stored Hash:", user.password);
        // console.log("Is Password Valid:", isPasswordValid);
        
        if (bcrypt.compare(password, user.password)) {
            const token = crypto.randomBytes(20).toString("hex");
            user.token = token;
            await user.save();
            res.status(httpStatus.OK).json({ token: token, message: "User logged In" });
        } else {
           
            console.log("Password validation failed.");
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid Username or Password!" });
        }
        
        
    }
    catch(e){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message : `Something went wrong! ${e}`});
    }
}

//get user history
 const getUserHistory = async (req, res) => {
    const { token } = req.query;
    console.log('Received request to get user history with token:', token);
  
    try {
      const user = await User.findOne({ token });
      if (!user) {
        console.log('User not found for token:', token);
        return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
      }
  
      const meetings = await Meeting.find({ user_id: user.username });
      console.log('User meeting history:', meetings);
  
      return res.status(httpStatus.OK).json(meetings);
    } catch (e) {
      console.error('Error getting user history:', e);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong! ${e}` });
    }
  };

  const addToHistory = async (req, res) => {
    const { token, meetingCode } = req.body;
    console.log('Received request to add to history:', { token, meetingCode });

    try {
        const user = await User.findOne({ token });
        if (!user) {
            console.log('User not found for token:', token);
            return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
        }

        // Check if the meetingCode already exists
        const existingMeeting = await Meeting.findOne({ meetingCode });
        if (existingMeeting) {
            return res.status(httpStatus.CONFLICT).json({ message: "Meeting code already exists" });
        }

        const newMeeting = new Meeting({
            user_id: user.username,
            meetingCode: meetingCode
        });

        await newMeeting.save(); 
        console.log('Meeting added to history for user:', user.username);

        res.status(httpStatus.CREATED).json({ message: "Meeting added to history" });
    } catch (e) {
        console.error('Error adding to history:', e);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong! ${e}` });
    }
};


export {login,register,getUserHistory,addToHistory};