const User = require('../models/userModel');
const jwt = require('jsonwebtoken');


async function authenticate(req, res, next) {
    let token;
    //token : Bearer ljafsdkhakdsfkhkjgh
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

        try {
            token = req.headers.authorization.split(' ')[1];
            // console.log(token);
            const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);

            req.user = await User.findById(payload._id).select('name email _id admin');
            console.log("user : ", req.user);
            next();
        } catch (err) {
            console.log(err);
            res.status(400).json({
                msg: "invalid token re-login then try again"
            })
            return;
        }

    }
    if (!(token)) {
        res.status(400).json({
            msg: "Not authorised, no token found",
        });
    }
}

module.exports = { authenticate };
