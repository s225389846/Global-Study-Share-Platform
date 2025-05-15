# Global-Study-Share-Platform

API Integration Guide

- Prerequisites
  Postman installed on your machine.
  Bearer Token for authentication (obtain from the login API).

- Getting Started
  Access the API collection on Postman using the link below:
  (https://sit725-tea.postman.co/workspace/QNA~b0cfabd8-8752-4ee6-993d-5e5f06ae8e27/collection/14202178-6b6243b8-23fa-49a3-8ff7-2adb457fa30b?action=share&creator=14202178)
  You will have to request access

Once the collection is imported into Postman, you will see all the necessary endpoints with their respective request bodies pre-filled.

To authenticate, use the Login API to obtain the Bearer Token and set it in the Authorization tab in Postman.

- Authentication
  For any request that requires authentication, include the Bearer Token in the Authorization header:
  Authorization Type: Bearer Token
  Token: {{token}} (Replace with your actual token from the Login API).

- API Endpoints Overview

- Auth Routes
  Register a new user, Login for token, and Logout.

- Questions Routes
  Fetch questions, create, update, or delete a question.

- Users Routes
  Manage users: create, update, delete, and retrieve user details.

- Profile Routes
  Get and update the logged-in user's profile.

- How to Use
  Import the collection into Postman using the provided link.
  Set the Authorization type to Bearer Token for all requests that require authentication.
  Replace {{token}} with the actual token from the Login request.
  Execute the API requests and see the responses.

- Database Setup
  You have been invited to the MongoDB Atlas project. Please accept the invitation.
  The URI for connecting to the MongoDB database has been set in the .env file under MONGODB_URI.
  The required database collections have been set up:
  Users
  Questions
  Answers
  Ensure that you have the correct MongoDB Atlas access credentials to interact with the database, that has been shared with you.

Front-end Setup

- Prerequisites
  Node.js and npm installed
  A modern browser (e.g., Google Chrome)
  A code editor like VS Code

- Technologies Used
  HTML, CSS, JavaScripts
  Bootstrap
  No frame work used

- Folder Structure
  main folder/
  ├── backend/
  │ ├── controllers/
  │ ├── middlewares/
  │ ├── models/
  │ ├── seeders/
  │ ├── utils/
  │ ├── .env
  │ └── server.js
  ├── node_modules/
  ├── public/
  │ ├── CSS/
  │ ├── images/
  │ ├── JS/
  │ ├── templates/
  │ │ ├── cms/
  │ │ └── user/
  | ├── .prettierignore
  │ ├── index.html
  ├── .gitignore
  ├── package.json
  ├── package-lock.json
  ├── README.md

- API Integration
  All pages that interact with the backend APIs use `fetch`

- Authentication flow

1. Login send the post request
2. On success he response has token and role
3. User role redirects to user dashboard, and admin roles redirects to admin panel
