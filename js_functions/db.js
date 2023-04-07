const mysql = require('mysql');  
var user_details_con = mysql.createConnection({  
    host: process.env.HOST,  
    user: process.env.USERID,  
    password: process.env.PASSWORD,
    database: process.env.DATABASE_NAME
});  

module.exports = {
    user_details_con : user_details_con
}