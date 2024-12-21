# 🍴 **BitesBook**  

### A Recipe Management Platform for Food Lovers!  
Discover, share, and manage recipes with ease. BitesBook is a powerful web application built using **Node.js**, **Express**, **Sequelize**, **JWT**, and **SQL** on the backend and offers seamless interaction with users for recipe management.

---

## 🌟 **Features**
- **User Authentication**: Secure login and signup with JWT-based authentication.
- **Recipe Management**: Create, read, update, and delete recipes.
- **Categorization**: Easily categorize recipes (e.g., Starter, Main Course, Dessert).
- **Search & Filter**: Search for recipes or filter by category and difficulty.
- **User Following**: Follow your favorite authors to stay updated with their recipes.
- **Ratings & Reviews**: Add reviews and ratings to recipes and view average ratings.
- **Responsive Design**: Fully optimized for desktop and mobile devices.

---

## 🚀 **Tech Stack**
### **Frontend**:  
- React.js  
- Tailwind CSS  
- Axios  

### **Backend**:  
- Node.js  
- Express.js  
- Sequelize ORM  
- MySQL  

### **Authentication**:  
- JSON Web Tokens (JWT)  

---

## 📂 **Folder Structure**
BitesBook/
│
├── backend/
│   ├── controllers/         # API controllers for handling logic
│   ├── models/              # Sequelize models for User, Recipe, Review, etc.
│   ├── routes/              # Routes for APIs
│   ├── middleware/          # JWT authentication middleware
│   ├── config/              # Database configurations
│   └── app.js               # Main server file
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Application pages (Home, Login, Signup, etc.)
│   │   ├── styles/          # Tailwind CSS styles
│   │   ├── App.js           # Root React component
│   │   └── index.js         # React entry point
│   └── public/              # Static files
│
└── README.md                # Project documentation


---

## 🎉 **Getting Started**

### **Prerequisites**
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MySQL](https://www.mysql.com/)
- [Git](https://git-scm.com/)

### **Installation**
1. Clone the repository:  
   ```bash
   git clone https://github.com/Divygupta208/BitesBook.git
   cd BitesBook
Install dependencies:
Backend:

bash
Copy code
cd backend
npm install
Frontend:

bash
Copy code
cd frontend
npm install
Configure the environment:

Create a .env file in the backend folder with the following variables:
makefile
Copy code
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=bitesbook
JWT_SECRET=your_jwt_secret
Start the application:
Backend:

bash
Copy code
cd backend
npm start
Frontend:

## 🛠️ **API Endpoints**


Authentication
POST /user/signup - Register a new user.
POST /user/login - Log in a user.
Recipes.
GET /recipes - Fetch all recipes.
POST /recipes/add - Add a new recipe.
PUT /recipes/:id/edit - Edit a recipe.
DELETE /recipes/:id - Delete a recipe.
Reviews
POST /reviews/add - Add a review to a recipe
GET /reviews/:recipeId - Get reviews for a specific recipe


## 🤝 **Contributing**
Contributions, issues, and feature requests are welcome!

Fork the repository.
Create a new branch (git checkout -b feature-name).
Commit your changes (git commit -m 'Add some feature').
Push to the branch (git push origin feature-name).
Open a Pull Request.
📄 License
This project is licensed under the MIT License. See the LICENSE file for details.

###📧 **Contact**
For any inquiries or support:

Author: Divy Gupta
GitHub: Divygupta208

bash
Copy code
cd frontend
npm start
Visit the application at http://localhost:3000.
