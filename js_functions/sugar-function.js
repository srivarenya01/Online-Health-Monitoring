const {user_details_con} = require('./db');
const {getMembers, getmember} = require('./member-function');

function fbs_check(fbs) {
    if (fbs >= 125) {
        return "Diabetes";
    }else if(fbs >= 101 && fbs < 125){
        return "Pre-Diabetes";
    }else if(fbs >= 70 && fbs < 100){
        return "Normal";
    }else{
        return "Incorrect Data";
    }
}

function pbs_check(pbs) {
    if(pbs >= 200) {
      return "Diabetes";
    }else if(pbs >= 141 && pbs < 200) {
      return "Pre-Diabetes";
    }else if(pbs >= 70 && pbs < 140){
      return "Normal";
    }else{
        return "Incorrect Data";
    }
}

const addSugar = (req, res) => {
    let body = req.body;
    let member_id = body.member;
    let fbs = body.fbs;
    let pbs = body.pbs;

    const get_member = "SELECT member_name FROM members WHERE member_id = ?"
    user_details_con.query(get_member, [member_id], function(err, result){
        if(err){
            console.error('error : ', err);
            getMembers(req.session.userid).then(function(members){
                res.render('dashboard/features/sugar/sugar-monitor.ejs', {
                    pagename : "Sugar Monitor",
                    familyMembers : members,
                    username : req.session.username,
                    message : "Insertion Failed"
                });
            });
        }else{
            member_name = result[0].member_name;
            const sql = "INSERT INTO sugar(member_id, member_name, fbs, pbs) VALUES (?, ?, ?, ?)";
            user_details_con.query(sql, [member_id, member_name, fbs, pbs], function(err, result){
                if(err){
                    console.error('Error : ', err);
                    getMembers(req.session.userid).then(function(members){
                        res.render('dashboard/features/sugar/sugar-monitor.ejs', {
                            pagename : "Sugar Monitor",
                            familyMembers : members,
                            username : req.session.username,
                            message : "Insertion Failed"
                        });
                    });
                }else{
                    res.redirect('blood-sugar-report');
                }
            });
        }
    });
}

const get_sugar_history = (id) => {
    return new Promise(function(resolve, reject) {
        const sql = "SELECT * FROM sugar WHERE member_id = ?";
        user_details_con.query(sql, [id], function(err, result){
            if(err){
                console.error(err);
                res.redirect('users/dashboard');
            }else{  
                result.forEach(data => {
                    data.pbs_o = pbs_check(data.pbs);
                    data.fbs_o = pbs_check(data.fbs);
                });
                resolve(result);
            }     
        });     
    });
}

const sugarreport = (req, res) =>{
    if(req.session.authenticated){  
        const memberId = req.params.id;
        get_sugar_history(memberId).then(function(history){
            getmember(memberId).then(function(activeMember){
                getMembers(req.session.userid).then(function(members){
                    res.render('dashboard/features/sugar/sugar-report.ejs', {
                        pagename : "Sugar Report",
                        username : req.session.username,
                        members : members, 
                        activeMember : activeMember,
                        sugarHistory : history
                    })
                });
            }); 
        });
    }else{
        res.redirect("/");
    }
}
  
  

module.exports = {
    addSugar : addSugar,
    sugarreport : sugarreport
}