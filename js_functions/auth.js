const {user_details_con} = require('./db');

const logincheck = (req, res) => {
    let body = req.body;
    const password = 'SELECT username, password FROM user_details WHERE mail=?';
    user_details_con.query(password, body.mail, (error, results, fields) => {
      if (error) {
        console.error('Error retrieving data from database: ', error);
      } else {
        console.log('Data retrieved from database');
        if (results[0].password === body.password){
            req.session.authenticated = true;
            req.session.username = results[0].username;
            res.redirect('/');
        }else{
            res.render('login/login.ejs', {message : "Incorrect Password !!!"});
        }
      }
    });
}

const signupcheck = (req, res) => {
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
                    console.error('error : ', err);
                    res.render('login/signup.ejs', {message : "Email Address Already Exists !!!"});
                }else{
                    res.render('login/login.ejs', {message : "Registered Successfully"});
                }
            });
        }); 
    }
}

module.exports = {
    logincheck : logincheck,
    signupcheck : signupcheck
}