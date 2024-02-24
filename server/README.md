## E-commerce MERN stack project
## course plan
## Environment setup
## Express server setup
## create express server -->express
## HTTP request & response
## nodemon and morgan package ->nodemon,morgan

## API testing with postman
## Middleware & Types of Middleware
## Express Error Handling Middleware ->body-parser
## How to handle HTTP errors ->http-errors

## How to secure API -> xss-clean, express-rate-limit

## Environment variable & .gitignore ->dotenv

## MVC Architecture ->mongoose

## connect to MongoDB database

## Schema & Model for User

## create seed route for testing

## get /api/users -> isAdmin -> getallUsers -> searchByName + pagination functionality

## responseHandler Controller for error or success

## Get /api/users/:id ->get a single user by id

## How to create services in the backend

## Delete /api/users/:id ->delte a single user by id
## Refactoring & reusability, dynamic
## deleteImage helper
## add express validator middleware
## add multer middleware for file upload
## POST /api/users -> create an user
## PUT /api/users/:id ->update a single user by id

## Post:/api/users/register 
### - fetch data from request body
### - userExist
### - jwt->temporarily store data
### - email ->jwt

## Post:/api/users/verify
### - token
### - verify token
### - fetch data from token
### - finally store the user

## Post /api/users/process-register ->process the register
## Create JWT
## setup smtp server & perpare email
## send email
## POST /api/users/verify ->verify + register into database
## add express validator middleware
## add multer middleware for file upload
## PUT /api/users/:id -> update a single user by id

## post/api/auth/login ->user login
## post/api/auth/logout ->user logout
## middlewares -> isLoggedIn,isLoggedOut,isAdmin
## input validation when signed in a refactoring
## GET/api/auth/refress -> refresh the token

## PUT /api/users/ban-user ->ban user
## PUT /api/users/unban-user -> unban user
## PUT /api/users/update-password ->update the password
## POST /api/users/forget-password ->forget the password
## PUT /api/users/reset-password -> reset the password

## POST/api/auth/refresh-token ->generate refresh the token
## GET/api/auth/protected -> verify the token and give access to other routes
## refactoring
## modular code structure
## winston logger library
## logshow -> winston/alternatave loger 

## Category  Model and Input Validation
## Category  CRUD - Create Category
## get: api/categories
## get: api/categories/:slug
## make a slug using a packeg-> slugify
## Category  CRUD - Read Category
## Category  CRUD - Update Category
## PUT: api/categories/:slug
## Category  CRUD - Delete Category
## Delete: api/categories/:slug


## Product API - Product Model
## Product API - create seed route for testing products
## Product API - Create POST/api/products
## Product API - Read Model GET /api/products
## Product API - Read Model GET /api/products
## Product API - Read Model GET /api/product/:slug
## Product API - Update Model
## Product API - Delete Model

## Product API - Search Products
## Product API - Filter Products