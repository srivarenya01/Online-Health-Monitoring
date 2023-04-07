require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const { get } = require('http');
const app = express()
const mysql = require('mysql');  

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('views', 'views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
 
var user_details_con = mysql.createConnection({  
    host: process.env.HOST,  
    user: process.env.USERID,  
    password: process.env.PASSWORD,
    database: process.env.DATABASE_NAME
});  

let loggedin = false;
let username = "";

app.get('/', function(req, res){
    if(loggedin){
        res.redirect('login');
    }
    res.redirect('user');
});

app.get('/login', function(req, res){
    res.render('login/login.ejs', {message : null});
});

app.get('/signup', function(req, res){
    var message = null;
    res.render('login/signup.ejs', {message : null});
});

app.post('/login', function(req, res){
    let body = req.body;
    const password = 'SELECT username, password FROM user_details WHERE mail=?';
    user_details_con.query(password, body.mail, (error, results, fields) => {
      if (error) {
        console.error('Error retrieving data from database: ', error);
      } else {
        console.log('Data retrieved from database');
        if (results[0].password === body.password){
            loggedin = true;
            username = results[0].username;
            res.redirect('/');
        }else{
            res.render('login/login.ejs', {message : "Incorrect Password !!!"});
        }
      }
    });
});

app.post('/signup', function(req, res){
    let body = req.body;
    if(body.password1 === body.password2) {
        const username = body.name;
        const password = body.password1;
        const mail = body.mail;
        const phone = body.number;
        user_details_con.connect(function(err){
            if(err) console.error('Error : ', err);
            console.log('Connected to database');
            var sql = "INSERT INTO user_details(username, password, mail, phone) VALUES (?, ?, ?, ?)";
            user_details_con.query(sql, [username, password, mail, phone], function(err, result){
                if(err){
                    const message = 'This is an alert message!';
                    res.render('login/signup.ejs', {message : "Email Address Already Exists !!!"});
                }else{
                    res.render('login/login.ejs', {message : null});
                }
            });
        }); 
    }
});

app.get('/user', function(req, res){
    res.render('dashboard/open.ejs', {username : username});
});

app.listen(3000, function(){
    console.log('Listening on port 3000');
});