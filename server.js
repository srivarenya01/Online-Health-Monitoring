require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const app = express()
const session = require('express-session');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('views', 'views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

app.get('/', function(req, res){
    if(req.session.authenticated){
        res.redirect('user');
    }else{
        res.redirect('login');
    }
});

app.use('/login', require('./routes/login'));
app.use('/signup', require('./routes/signup'));

app.get('/user', function(req, res){
    res.render('dashboard/open.ejs', {username : req.session.username});
});

app.listen(3000, function(){
    console.log('Listening on port 3000');
});