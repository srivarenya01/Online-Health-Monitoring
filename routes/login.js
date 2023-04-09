const router = require('express').Router();
const {logincheck} = require('../js_functions/auth')

router.get('/', function(req, res){
    req.session.authenticated = false;
    res.render('login/login.ejs', {message : null});
});
router.post('/', logincheck);

module.exports = router;