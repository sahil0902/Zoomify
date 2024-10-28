# Zoomify

Zoomify is a video conferencing application that allows users to create and join meetings. The application features user authentication, meeting history tracking, and real-time communication using Socket.IO. It is built with React for the frontend and Node.js with Express for the backend.

## Features

- User registration and login
- Create and join meetings using unique meeting codes
- View meeting history
- Real-time chat functionality during meetings
- Responsive design for a seamless user experience

## Technologies Used

- **Frontend**: React, Material-UI
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Real-time Communication**: Socket.IO
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure
/bac (Backend)

├── src

│ ├── app.js # Main application file

│ ├── controllers # Controllers for handling requests

│ ├── models # Mongoose models for MongoDB

│ ├── routes # Express routes

│ ├── .env # Environment variables

│ └── package.json # Backend dependencies and scripts

└── ...

/fro (Frontend)

├── src

│ ├── pages # React components for different pages

│ ├── contexts # Context API for state management

│ ├── App.js # Main React application file

│ ├── index.js # Entry point for React

│ └── package.json # Frontend dependencies and scripts

└── ...

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/zoomify.git
   cd zoomify
   ```

2. **Set up the backend**:
   - Navigate to the `bac` directory:
     ```bash
     cd bac
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file in the `bac/src` directory and add your MongoDB connection string:
     ```
     DBURL=your_mongodb_connection_string
     ```

   - Start the backend server:
     ```bash
     npm run dev
     ```

3. **Set up the frontend**:
   - Navigate to the `fro` directory:
     ```bash
     cd ../fro
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the frontend application:
     ```bash
     npm start
     ```

### Usage

- Open your browser and navigate to `http://localhost:3000` to access the application.
- Users can register, log in, create meetings, and join existing meetings using unique meeting codes.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
.
Conclusion
This README provides a comprehensive overview of your project, including its features, technologies used, project structure, and setup instructions. You can customize the content further based on your specific needs or preferences.
