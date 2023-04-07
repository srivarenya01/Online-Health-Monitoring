const router = require('express').Router();
const {signupcheck} = require('../js_functions/auth')

router.get('/', function(req, res){
    res.render('login/signup.ejs', {message : null});
});
router.post('/', signupcheck);

module.exports = router;