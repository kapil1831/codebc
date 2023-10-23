const router = require('express').Router();
const { registerUser, loginUser, getUser } = require('../controllers/userController');

const { authenticate } = require('../middleware/auth');


//@desc register user
//@route POST /api/user/register
//@access Public
router.route('/register').post(registerUser);


//@desc login user
//@route POST /api/user/login
//@access Public
router.route('/login').post(loginUser);


//@desc get user
//@route GET /api/user/me
//@access Private
router.route('/me').get(authenticate, getUser);


module.exports = router;