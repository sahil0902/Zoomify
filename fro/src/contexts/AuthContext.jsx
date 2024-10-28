import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import httpStatus from 'http-status';

export const AuthContext = createContext({});

const client = axios.create({
    baseURL: "//localhost:8000/api/v1/users"
});

export const AuthProvider = ({ children }) => {
    const authContext = useContext(AuthContext);
    const [userData, setUserData] = useState(authContext);
    const navigate = useNavigate();  // Use useNavigate for programmatic navigation

    const handleRegister = async (name, username, password) => {
        try {
            let request = await client.post('/register', { name, username, password });
            if (request.status === httpStatus.CREATED) {
                localStorage.setItem('token', request.data.token); // Ensure token is set
                return request.data.message; // Return success message
            } else {
                throw new Error('Registration failed'); // Throw error if not created
            }
        } catch (e) {
            console.log(e);
            throw e; // Rethrow the error to be caught in the calling function
        }
    };

    // Login route
    const handleLogin = async (username, password) => {
        try {
            let request = await client.post('/login', { username, password });
            if (request.status === httpStatus.OK) {
                localStorage.setItem('token', request.data.token); // Ensure token is set
                return request.data; // Return the entire response data
            } else {
                throw new Error('Login failed'); // Throw error if not OK
            }
        } catch (e) {
            console.log(e);
            throw e; // Rethrow the error to be caught in the calling function
        }
    };

    // Get all history of user

  const getHisttoryofUser = async () => {
    try {
      let request = await client.get('/get_all_activity', {
        params: {
          token: localStorage.getItem('token')
        }
      });
      if (request.status === httpStatus.OK) {
        return request.data;
      } else {
        throw new Error('Failed to get history');
      }
    } catch (e) {
      console.log(e);
      throw e;
    }
    };

    const addToUserHistory = async (meetingCode) => {
        try{
            let request = await client.post('/add_to_activity', {token: localStorage.getItem('token'), meetingCode});
            if(request.status === httpStatus.CREATED){
                return request.data;
            }else{
                throw new Error('Failed to add to history');
            }
        }
        catch(e){
            console.log(e);
            throw e;
        }
    }

    const data = {
        userData,
        setUserData,
        handleRegister,
        handleLogin,
        getHisttoryofUser,
        addToUserHistory
    };



    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    );
};
