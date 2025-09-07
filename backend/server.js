import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const express = require('express');
const mysql = require("mysql2");

const app = express();
const PORT = 8000;

//connect to my mysql database

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
    } else {
      console.log('Connected to the MySQL database.');
    }
  });

app.listen(PORT, (error) => {
    if(!error) {
        console.log(`Server listening on port ${PORT}`)
    }
    else
    {
        console.log('Error starting to server', error);
    }
});


function createWebToken(user) {
    const payload = {
        //here goes what is needed for user based on database schema
        email: user_email
    }


}

//api definitions

app.get('/logim', async (req, res) => {

    const {user_email, user_password} = req.body;

    const query = "SELECT * FROM users WHERE user_email = ? AND user_password = ?";

    try 
    {
        const [rows] = await db.query(query, [user_email, user_password]);

        const mail = {user_email: req.body.user_email}

        if (rows.length == 0)
        {
            console.log("no user found");
            return null;
            //tell caller that no results were found
        }
        else
        {
            console.log("user found")
            const accessToken = jwt.sign( mail , process.env.ACCESS_TOKEN_SECRET);
            return res.json({ accessTokenoken: accessToken })
        }

    } 
    catch (err)
    {
        console.log(error);
    }
});

function authenticateToken(req, res, nex) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    
    jwt.verify (token, process.env.ACCESS_TOKEN_SECRET, (err, mail) => {


    })

    
}


app.post('/add-user', async (req, res) => {

   const {user_email, username, user_password} = req.body;

   const selectQuery = ""
   const query = "INSERT into "
   

   try
   {
    const [result] = await db.query()
        
   }
   catch (error)
   {

   }

});