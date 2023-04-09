const {user_details_con} = require('./db');
const {getMembers, getmember} = require('./member-function');

function bp_check(sys, dia) {
    if (sys <= 90 && dia <= 60) {
      return "Low BP";
    } else if (sys > 90 && sys < 120 && dia > 60 && dia < 80) {
      return "Normal BP";
    } else if (sys >= 120 && sys < 140 && dia >= 80 && dia < 90) {
      return "Little High BP";
    } else if (sys >= 140 || dia >= 90) {
      return "High BP";
    } else {
      return "Elevated";
    }
}
  
  

const addbp = (req, res) => {
    let body = req.body;
    let member_id = body.member;
    let sys = body.sys;
    let dia = body.dia;

    const get_member = "SELECT member_name FROM members WHERE member_id = ?"
    user_details_con.query(get_member, [member_id], function(err, result){
        if(err){
            console.error('error : ', err);
            getMembers(req.session.userid).then(function(members){
                res.render('dashboard/features/bp/bp-monitor.ejs', {
                    pagename : "BP Monitor",
                    familyMembers : members,
                    username : req.session.username,
                    message : "Insertion Failed"
                });
            });
        }else{
            member_name = result[0].member_name;
            const sql = "INSERT INTO bp(member_id, member_name, sys, dia) VALUES (?, ?, ?, ?)";
            user_details_con.query(sql, [member_id, member_name, sys, dia], function(err, result){
                if(err){
                    console.error('Error : ', err);
                    getMembers(req.session.userid).then(function(members){
                        res.render('dashboard/features/bp/bp-monitor.ejs', {
                            pagename : "BP Monitor",
                            familyMembers : members,
                            username : req.session.username,
                            message : "Insertion Failed"
                        });
                    });
                }else{
                    res.redirect('bp-report');
                }
            });
        }
    });
}

const get_bp_history = (id) => {
    return new Promise(function(resolve, reject) {
        const sql = "SELECT * FROM bp WHERE member_id = ?";
        user_details_con.query(sql, [id], function(err, result){
            if(err){
                console.error(err);
                res.redirect('users/dashboard');
            }else{  
                result.forEach(data => {
                    data.result = bp_check(data.sys, data.dia);
                });
                resolve(result);
            }     
        });     
    });
}

const bpreport = (req, res) =>{
    if(req.session.authenticated){  
        const memberId = req.params.id;
        get_bp_history(memberId).then(function(history){
            getmember(memberId).then(function(activeMember){
                getMembers(req.session.userid).then(function(members){
                    res.render('dashboard/features/bp/bp-report.ejs', {
                        pagename : "BP Report",
                        username : req.session.username,
                        members : members, 
                        activeMember : activeMember,
                        bpHistory : history
                    })
                });
            }); 
        });
    }else{
        res.redirect("/");
    }
}

const bpdelete = (req, res) => {
    if(req.session.authenticated){  
        const id = req.params.id;
        const sql = "DELETE FROM bp WHERE member_id = ?";
        user_details_con.query(sql, [id], function(err, result){
            if(err){
                console.error(err);
                res.redirect('/users/dashboard');
            }else{  
                get_bp_history(id).then(function(history){
                    getmember(id).then(function(activeMember){
                        getMembers(req.session.userid).then(function(members){
                            res.render('dashboard/features/bp/bp-report.ejs', {
                                pagename : "BP Report",
                                username : req.session.username,
                                members : members, 
                                activeMember : activeMember,
                                bpHistory : history
                            });
                        });
                    }); 
                });    
            }    
        });
    }else{
        res.redirect("/");
    }
}
  

module.exports = {
    addbp : addbp,
    bpreport : bpreport,
    bpdelete : bpdelete
}