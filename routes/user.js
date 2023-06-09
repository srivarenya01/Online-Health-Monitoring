const router = require('express').Router();
const {addMember, getMembers, delmember} = require('../js_functions/member-function');
const {addTemperature, tempreport, tempdelete, getTempDates} = require('../js_functions/temperature-function');
const {addSugar, sugarreport, sugardelete, getSugarDates} = require('../js_functions/sugar-function');
const {addbp, bpreport, bpdelete, getBpDates} = require('../js_functions/bp-function');

router.get('/', function(req, res){
    if(req.session.authenticated){
        res.render('dashboard/dashboard.ejs', {
            pagename : "Dashboard",
            username : req.session.username
        });
    }else{
        res.redirect("/");
    }
});

router.get('/dashboard', function(req, res){
    res.redirect("/");
});

router.get('/members', function(req, res){
    if(req.session.authenticated){
        getMembers(req.session.userid).then(function(members){
            req.members = members
            res.render('dashboard/features/members.ejs', {
                pagename : "Members",
                username : req.session.username,
                message : null,
                members : members
            });
        });
    }else{
        res.redirect("/");
    }
});

router.post('/members', addMember);

router.get('/bp-monitor', function(req, res){
    if(req.session.authenticated){
        if(req.session.authenticated){
            getMembers(req.session.userid).then(function(members){
                res.render('dashboard/features/bp/bp-monitor.ejs', {
                    pagename : "BP Monitor",
                    username : req.session.username,
                    familyMembers : members,
                    message : null
                });
            });
        }else{
            res.redirect("/");
        }
    }else{
        res.redirect("/");
    }
});

router.post('/bp-monitor', addbp);

router.get('/bp-report', function(req, res){
    if(req.session.authenticated){
        getMembers(req.session.userid).then(function(members){
            res.render('dashboard/features/bp/bp-report.ejs', {
                pagename : "Blood Pressure Report",
                username : req.session.username,
                members : members, 
                activeMember : null
            })
        });
    }else{
        res.redirect("/");
    }
});

router.get('/sugar-monitor', function(req, res){
    if(req.session.authenticated){
        getMembers(req.session.userid).then(function(members){
            res.render('dashboard/features/sugar/sugar-monitor.ejs', {
                pagename : "Sugar Monitor",
                username : req.session.username,
                familyMembers : members,
                message : null
            });
        });
    }else{
        res.redirect("/");
    }
});

router.post('/sugar-monitor', addSugar);

router.get('/blood-sugar-report', function(req, res){
    if(req.session.authenticated){
        getMembers(req.session.userid).then(function(members){
            res.render('dashboard/features/sugar/sugar-report.ejs', {
                pagename : "Blood Sugar Report",
                username : req.session.username,
                members : members, 
                activeMember : null
            })
        });
    }else{
        res.redirect("/");
    }
});

router.get('/temperature', function(req, res){
    if(req.session.authenticated){
        getMembers(req.session.userid).then(function(members){
            res.render('dashboard/features/temperature/temperature.ejs', {
                pagename : "Temperature",
                familyMembers : members,
                username : req.session.username,
                message : null
            });
        });
    }else{
        res.redirect("/");
    }
});

router.post('/temperature', addTemperature);

router.get('/temperature-report', function(req, res){
    if(req.session.authenticated){
        getMembers(req.session.userid).then(function(members){
            res.render('dashboard/features/temperature/temperature-report.ejs', {
                pagename : "Temperature Report",
                username : req.session.username,
                members : members, 
                activeMember : null
            })
        });
    }else{
        res.redirect("/");
    }
});

router.get('/report/temp/:id', getTempDates);
router.get('/report/sugar/:id', getSugarDates);
router.get('/report/bp/:id', getBpDates);

router.post('/report/temp/:id', tempreport);
router.post('/report/sugar/:id', sugarreport);
router.post('/report/bp/:id', bpreport);

router.get('/report/temp/:id/delete', tempdelete);
router.get('/report/sugar/:id/delete', sugardelete);
router.get('/report/bp/:id/delete', bpdelete);
router.get('/members/delete/:id', delmember);
  

module.exports = router;