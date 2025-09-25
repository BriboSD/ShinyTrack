import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import express from "express";
import mysql from "mysql2/promise";
import crypto from "crypto";
import cors from "cors";

dotenv.config();


const app = express();
const PORT = 8000;

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true // needed if you plan to use cookies
  }));
app.use(express.json());

//connect to my mysql database

const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});


    console.log('Connected to the MySQL database.');


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

//============== api definitions =================

app.post('/login', async (req, res) => {

    const {user_email, user_password} = req.body;

    const query = "SELECT * FROM users WHERE user_email = ?";


    try 
    {
        const [rows] = await db.query(query, [user_email]);

        const mail = {user_email: req.body.user_email}

        if (rows.length == 0)
        {
            console.log("no user found");
            return res.status(401).json({ error: "Invalid email or password" });
        }

        console.log("user found")
        const user = rows[0]
        const correctPassword = await bcrypt.compare(user_password, user.user_password)
        if(!correctPassword)
        {
            console.log("incorrect password")
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const accessToken = createWebToken(user.user_id, user.username)

        //make refresh token:
        const refreshToken = crypto.randomBytes(64).toString("hex");
        const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

        await db.query(
            "INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 DAY))",
            [user.user_id, refreshTokenHash]
            );
        
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, maxAge: 24*60*60*1000 }); //max age---24 hours


        //refresh token created, can send back access token (and also send http secure cookie route to store hashed refresh token version to compare against db, but do that later)
        return res.json({
            accessToken: accessToken,
            userId: user.user_id,
            username: user.username
        });

    } 
    catch (err)
    {
        console.log("Login error:", err);
        return res.status(500).json({ error: "Internal server error" });

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
   const query = "INSERT INTO users (user_email, user_password, username) VALUES (?, ?, ?)";
   
   try
   {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user_password, saltRounds);
        const [result] = await db.query(query, [user_email, hashedPassword, username]);

        //token stuff
        const accessToken = createWebToken(result.insertId, username)

        const refreshToken = crypto.randomBytes(64).toString("hex");
        const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

        await db.query(
            "INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 DAY))",
            [result.insertId, refreshTokenHash]
        );
        
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, maxAge: 24*60*60*1000 }); //max age---24 houRs

        return res.status(201).json({
            message: "User created successfully",
            userId: result.insertId,
            email: user_email,
            username: username,
            accessToken: accessToken
    });
        
   }
   catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: "Email already in use" });
        }
        console.error("Error details:", err.message, err.stack);
        return res.status(500).json({ error: "Server error", details: err.message });
    }

});