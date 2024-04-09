const express = require('express')
const router = express.Router()
const client = require('../db/conn');
const jwtutil = require('../utils/jwt');
const validate = require('../utils/tokenvalidate');

router.get('/', (req, res) => {
  res.send('Auth home')
})

router.get('/verify', validate, async (req, res) => {
    // let verified = await jwtutil.verify(req.body.token);
    res.json({"data":req.user}); 
})

router.post('/login', async (req,res) => {
    const result = await client.query('SELECT * from users where email = $1',[req.body.email]);
    if(result.rows.length > 0){
        if(result.rows[0].password == req.body.password){
            delete result.rows[0].password;
            let authtoken = await jwtutil.create(result.rows[0]);
            res.json({"token":authtoken,"user":result.rows[0]});
        }
        else{
            res.status(401).json({"error":"Invalid Password"});
        }
        
    }
    else{
        res.status(401).json({"error":"Invalid Email"});
    }
});

router.post('/signup', async (req,res) => {
    const result = await client.query('INSERT into users (username,email,password) VALUES ($1,$2,$3)',[req.body.username,req.body.email,req.body.password]);
    if(result.rowCount == 1){
        res.json({"message":"Added new user"});
    }
});

router.get('/users', async (req,res) => {
    const result = await client.query('select id,username,email from users');
    res.json({"users":result.rows});
});



module.exports = router