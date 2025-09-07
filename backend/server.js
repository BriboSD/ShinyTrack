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

function createWebToken(id, name ) {
    const payload = {
        //here goes what is needed for user based on database schema
        user_id: id,
        username: name
    };

    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '2h'});
}

//api definitions

app.get('/login', async (req, res) => {

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
        }
        else
        {
            console.log("user found")
            const user = rows[0]
            const accessToken = createWebToken(user.user_id, user.user_password)

            //make refresh token:
            const refreshToken = crypto.randomBytes(64).toString("hex");
            const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

            await db.query(
                "INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 DAY))",
                [user.id, refreshTokenHash]
              );
            
            //refresh token created, can send back access token (and also send http secure cookie route to store hashed refresh token version to compare against db, but do that later)
            return res.json({
                accessToken: accessToken,
                userId: user.userId,
                username: user.username
            });

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