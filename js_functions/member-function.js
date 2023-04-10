const {user_details_con} = require('./db');

const addMember = (req, res) =>{
    let body = req.body;
    const member_name = body.member_name;
    const age = body.age;
    const weight = body.weight;
    const gender = body.gender;
    if(age < 0){
        getMembers(req.session.userid).then(function(members){
            res.render('dashboard/features/members.ejs', {
                pagename : "Members",
                username : req.session.username,
                message : "Negative Age !!",
                members : req.members
            });
        });
    }else if(age > 100){
        getMembers(req.session.userid).then(function(members){  
            res.render('dashboard/features/members.ejs', {
                pagename : "Members",
                username : req.session.username,
                message : "Die for the sake of humanity !!",
                members : req.members
            });
        });
    }else if(weight < 0){
        getMembers(req.session.userid).then(function(members){
            res.render('dashboard/features/members.ejs', {
                pagename : "Members",
                username : req.session.username,
                message : "Negative Weight !!",
                members : req.members
            });
        });
    }else{
        const sql = "INSERT INTO members(user_id, member_name, age, weight, gender) VALUES (?, ?, ?, ?, ?)"
        user_details_con.query(sql, [req.session.userid, member_name, age, weight, gender], function(err, result){
            if(err){
                console.error('error : ', err);
                res.render('dashboard/features/members.ejs', {
                    pagename : "Members",
                    username : req.session.username,
                    message : "Failed in Inserting Member !!",
                    members : req.members
                });
            }else{
                console.log("Inserted Successfully");
                res.redirect('/users/members')
            }
        });
    }
}

const getMembers = (userid) => {
    return new Promise(function(resolve, reject) {
        const sql = "SELECT * FROM members WHERE user_id = ?";
        var familyMembers = []
        user_details_con.query(sql, [userid], function(err, result){
            if(err){
                console.error(err);
                res.redirect('/user/dashboard');
            }else{
                let arr = Array.from(result);
                arr.forEach(function(member){
                    familyMembers.push({
                        member_id : member.member_id,
                        member_name : member.member_name,
                        age : member.age,
                        gender : member.gender,
                        weight : member.weight
                    });
                });
                resolve(familyMembers);
            }     
        });
    });
}

const getmember = (id) => {
    return new Promise(function(resolve, reject) {
        const sql = "SELECT * FROM members WHERE member_id = ?";
        user_details_con.query(sql, [id], function(err, result){
            if(err){
                console.error(err);
                res.redirect('/user/dashboard');
            }else{  
                resolve(result);
            }     
        });     
    });
}

const delmember = (req, res) => {
    id = req.params.id;
    console.log('here : ', id);
    if(req.session.authenticated){  
        const id = req.params.id;
        let sql = "DELETE FROM bp WHERE member_id = ?";
        user_details_con.query(sql, [Number(id)], function(err, result){
            if(err){
                console.error('error : ', err);
                res.redirect('/user/dashboard');
            }else{  
                sql = "DELETE FROM sugar WHERE member_id = ?";
                user_details_con.query(sql, [Number(id)], function(err, result){
                    if(err){
                        console.error('error : ', err);
                        res.redirect('/user/dashboard');
                    }else{  
                        sql = "DELETE FROM temperature WHERE member_id = ?";
                        user_details_con.query(sql, [Number(id)], function(err, result){
                            if(err){
                                console.error('error : ', err);
                                res.redirect('/user/dashboard');
                            }else{  
                                sql = "DELETE FROM members WHERE member_id = ?";
                                user_details_con.query(sql, [Number(id)], function(err, result){
                                    if(err){
                                        console.error('error : ', err);
                                        res.redirect('/user/dashboard');
                                    }else{  
                                        res.redirect('/user/members');
                                    }    
                                });
                            }    
                        });
                    }    
                });
            }    
        });
    }else{
        res.redirect("/");
    }
}

module.exports = {
    addMember : addMember,
    getMembers : getMembers,
    getmember : getmember,
    delmember : delmember
}