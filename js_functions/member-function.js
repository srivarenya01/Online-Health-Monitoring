const {user_details_con} = require('./db');

const addMember = (req, res) =>{
    let body = req.body;
    const member_name = body.member_name;
    const age = body.age;
    const weight = body.weight;
    const gender = body.gender;
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
            res.redirect('members')
        }
    });
}

const getMembers = (userid) => {
    return new Promise(function(resolve, reject) {
        const sql = "SELECT * FROM members WHERE user_id = ?";
        var familyMembers = []
        user_details_con.query(sql, [userid], function(err, result){
            if(err){
                console.error(err);
                res.redirect('users/dashboard');
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
                res.redirect('users/dashboard');
            }else{  
                resolve(result);
            }     
        });     
    });
}

module.exports = {
    addMember : addMember,
    getMembers : getMembers,
    getmember : getmember
}