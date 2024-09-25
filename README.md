Project-Management_Tool
This project was bootstrapped with Create React App.

About the project
Build a solution for easy maintenance for employee records, their projects and payments.Reducing time taken for maintaining records and calculating cost by automatic cost calculation feature.

Built with
The tech stacks used here are:

React.js
Node.js
Express.js
MongoDb
External Packages:jwt, validator, mongoose, react-router-dom
Getting Started
To get a local copy up and running follow these simple example steps.

Prerequisites
You must have VS studio installed in your system.
You must have created a cluster and database in mongodb atlas.
Installation
On your VS machine, open a new terminal

Use the following command to clone the repository
git clone https://github.com/rishirishav0912/Nuclipp_project_management
Create a config.env file in server directory
ADMIN = "rishi111223rr"
PORT = 4000

write the following in the file
write the connection string of cluster of mongodb in mongodb.connect in server.js in backend folder

Navigate to the project's root directory:
cd Nuclipp_project_management
cd frontend
Run the following command to install the project dependencies using npm:
npm install
use the following command
npm start
Start Server

Open another terminal and Navigate to the server directory using the cd command:
cd backend
Run the following command to start the server:
nodemon server.js
