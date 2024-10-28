
import { Server } from "socket.io";

let connections = {}; // Stores arrays of socket IDs for each call path
let messages = {};    // Stores chat messages for each path (not yet implemented)
let timeOnline = {};  // Stores the connection time for each socket ID

const connectToSocket = (server) => {
    const io = new Server(server,{
        cors : {
            origin : "*",
        methods: ["GET","POST"],
        allowedHeaders : ["*"],
        credentials : true
        }
        
    });
    

    // Event handler for a new connection
    io.on("connection", (socket) => {
       console.log("something connected");
        // Event handler for a user joining a callS
        socket.on("join-call", (path) => {
            // Initialize the connections array for this path if it doesn't exist
            if (connections[path] === undefined) {
                connections[path] = [];
            }

            // Add the current user's socket ID to the connections array for this path
            connections[path].push(socket.id);

            // Record the connection time for this user's socket ID
            timeOnline[socket.id] = new Date();

            // Notify all users in the same path that a new user has joined
            for (let i = 0; i < connections[path].length; i++) {
                io.to(connections[path][i]).emit("user-joined",socket.id,connections[path]);
            }
      

    // If there are existing messages for this path, send them to the new user
    if (messages[path] !== undefined) {
        // Iterate through each message in the messages array for this path
        for (let a = 0; a < messages[path].length; a++) {
            // Emit a "chat-message" event to the new user's socket ID
            // Pass the message data, sender, and sender's socket ID as arguments
            io.to(socket.id).emit("chat-message", messages[path][a].data, messages[path][a].sender, messages[path][a]['socket-id-sender']);
        }
    }

});
// Event handler for signaling another user (typically used for WebRTC signaling)
socket.on("signal", (told, message) => {
    // Forward the signal message to the specified recipient (told)
    io.to(told).emit("signal", socket.id, message);
});

// Event handler for chat messages

socket.on("chat-message", (data, sender) => {
    // Use reduce to find the matching room for the sender's socket ID
    const [matchingRoom, found] = Object.entries(connections).reduce(
        ([room, isFound], [roomKey, roomValue]) => {
            if (!isFound && roomValue.includes(socket.id)) {
                return [roomKey, true];
            }
            return [room, isFound];
        },
        ['', false]
    );

    if (found) {
        // Initialize the messages array for this room if it doesn't exist
        if (messages[matchingRoom] === undefined) {
            console.log("message",matchingRoom,":",sender,data);
            messages[matchingRoom] = [];
        }

        // Store the new message in the messages array for this room
        messages[matchingRoom].push({
            sender: sender,
            data: data,
            'socket-id-sender': socket.id
        });

        console.log("message", matchingRoom, ":", sender, data);

        // Broadcast the message to all users in the same room
        connections[matchingRoom].forEach(element => {
            io.to(element).emit("chat-message", data, sender, socket.id);
        });
    }
});


// Event handler for when a user disconnects
socket.on("disconnect", () => {
    // Calculate the difference in time between now and when the user connected
    let diffTime = Math.abs(timeOnline[socket.id] - new Date());

    let key; // This will hold the room ID or key

    // Loop through all entries in the connections object
    for (const [room, persons] of Object.entries(connections)) {
        // Loop through all socket IDs in the current room's connections array
        for (let a = 0; a < persons.length; ++a) {
            if (persons[a] === socket.id) {
                key = room; // Found the room key where the user was connected

                // Notify all users in the room that this user has left
                for (let a = 0; a < connections[key].length; ++a) {
                    io.to(connections[key][a]).emit('user-left', socket.id);
                }

                // Remove the user's socket ID from the room's connections array
                let index = connections[key].indexOf(socket.id);
                connections[key].splice(index, 1);

                // If the room is now empty, delete the room from the connections object
                if (connections[key].length === 0) {
                    delete connections[key];
                }

                break; // Exit the loop once the user is found and removed
            }
        }
    }

    // Remove the user's connection time from the timeOnline object
    delete timeOnline[socket.id];
});
});


return io; // Return the initialized Socket.IO server
};

export default connectToSocket;