const {user_details_con} = require('./db');
const {getMembers, getmember} = require('./member-function');

const addTemperature = (req, res)=>{
    let body = req.body;
    let member_id = body.member;
    let temp = body.temp;

    if(temp < 0){
        getMembers(req.session.userid).then(function(members){
            res.render('dashboard/features/temperature/temperature.ejs', {
                pagename : "Temperature",
                familyMembers : members,
                username : req.session.username,
                message : "Person Dead !!"
            });
        });
    }else{
        const get_member = "SELECT member_name FROM members WHERE member_id = ?"
        user_details_con.query(get_member, [member_id], function(err, result){
            if(err){
                console.error('error : ', err);
                getMembers(req.session.userid).then(function(members){
                    res.render('dashboard/features/temperature/temperature.ejs', {
                        pagename : "Temperature",
                        familyMembers : members,
                        username : req.session.username,
                        message : "Insertion Failed"
                    });
                });
            }else{
                member_name = result[0].member_name;
                const sql = "INSERT INTO temperature(member_id, member_name, temperature) VALUES (?, ?, ?)";
                user_details_con.query(sql, [member_id, member_name, temp], function(err, result){
                    if(err){
                        console.error('Error : ', err);
                        getMembers(req.session.userid).then(function(members){
                            res.render('dashboard/features/temperature/temperature.ejs', {
                                pagename : "Temperature",
                                familyMembers : members,
                                username : req.session.username,
                                message : "Insertion Failed"
                            });
                        });
                    }else{
                        res.redirect('temperature-report');
                    }
                });
            }
        });
    }
}

const temp_check = (temperature) => {
    return new Promise(function(resolve, reject) {
        let report = "";
        if (temperature > 98.6) {
            report =  "High Temperature";
        }else if (temperature >= 97 && temperature <= 98.6) {
            report =  "Normal Temperature";
        }else {
            report =  "Low Temperature Than Normal Temperature";
        }
        resolve(report);
    });
    
}

const get_temp_history = (id) => {
    return new Promise(function(resolve, reject) {
        const sql = "SELECT * FROM temperature WHERE member_id = ?";
        user_details_con.query(sql, [id], function(err, result){
            if(err){
                console.error(err);
                res.redirect('/user/dashboard');
            }else{  
                result.forEach(data => {
                    temp_check(data.temperature).then(function(result){
                        data.check = result;
                    });
                });
                resolve(result);
            }     
        });     
    });
}

const rep = (memberId, req, res) => {
    get_temp_history(memberId).then(function(history){
        getmember(memberId).then(function(activeMember){
            getMembers(req.session.userid).then(function(members){
                res.render('dashboard/features/temperature/temperature-report.ejs', {
                    pagename : "Temperature Report",
                    username : req.session.username,
                    members : members, 
                    activeMember : activeMember,
                    tempHistory : history
                })
            });
        }); 
    });
}

const tempreport = (req, res) => {
    if(req.session.authenticated){  
        const memberId = req.params.id;
        const getusr = "SELECT user_id FROM members WHERE member_id = ?";
        user_details_con.query(getusr, [memberId], function(err, results){
            if(err){
                console.error(err);
                res.redirect('/user/dashboard');
            }else{
                if(results[0].user_id === req.session.userid){
                    rep(memberId, req, res);
                }else{
                    res.redirect('/user/dashboard');
                }
            }
        });
    }else{
        res.redirect("/");
    }
}

const del = (id, req, res) => {
    const sql = "DELETE FROM temperature WHERE member_id = ?";
    user_details_con.query(sql, [id], function(err, result){
        if(err){
            console.error(err);
            res.redirect('/user/dashboard');
        }else{  
            get_temp_history(id).then(function(history){
                getmember(id).then(function(activeMember){
                    getMembers(req.session.userid).then(function(members){
                        res.render('dashboard/features/temperature/temperature-report.ejs', {
                            pagename : "Temperature Report",
                            username : req.session.username,
                            members : members, 
                            activeMember : activeMember,
                            tempHistory : history
                        });
                    });
                }); 
            });    
        }    
    });
}

const tempdelete = (req, res) => {
    if(req.session.authenticated){  
        const id = req.params.id;
        const getusr = "SELECT user_id FROM members WHERE member_id = ?";
        user_details_con.query(getusr, [id], function(err, results){
            if(err){
                console.error(err);
                res.redirect('/user/dashboard');
            }else{
                if(results[0].user_id === req.session.userid){
                    del(id, req, res);
                    res.redirect('/user/temperature-report');
                }else{
                    res.redirect('/user/dashboard');
                }
            }
        });
    }else{
        res.redirect("/");
    }
}

module.exports = {
    addTemperature : addTemperature,
    tempreport : tempreport,
    tempdelete : tempdelete
}