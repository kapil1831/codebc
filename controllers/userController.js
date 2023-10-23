const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');


//register user
const registerUser = async (req, res) => {
    // console.log(req.body);
    if (!(req.body.name) || !(req.body.email) || !(req.body.password)) {
        res.status(400).json({
            msg: "Please provide all fields",
        });
        return;
    }

    try {

        const user = await User.findOne({ email: req.body.email });

        // console.log(user);

        if (user) {
            res.status(400).json({
                msg: "user already exists"
            })
            return;
        }

        const salt = await bcryptjs.genSalt(10);

        hashedPassword = await bcryptjs.hash(req.body.password, salt);

        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });

        if (!newUser) {
            throw new Error("failed to create object");
        }

        res.status(400).json({
            msg: "successfully registered user",
            user: {
                name: newUser.name,
                email: newUser.email,
                admin: newUser.admin,
            }
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Internal server error. Try Again!!",
        });
    }


    // res.status(200).json({
    //     msg: "user got registered",
    // })
}

// const tokens = {};
//login user
const loginUser = async (req, res) => {
    // console.log(req.body);

    if (!(req.body.email) || !(req.body.password)) {
        res.status(400).json({
            msg: "Please provide all fields",
        });
        return;
    }
    try {
        const user = await User.findOne({ email: req.body.email });

        if (await bcryptjs.compare(req.body.password, user.password)) {

            const token = jwt.sign({
                _id: user._id,
                email: user.email,
            }, process.env.JWT_SECRET_KEY, {
                expiresIn: '1d'
            });

            res.status(200).json({
                msg: "user got logged in successfully",
                name: user.name,
                email: user.email,
                token,
            });
        } else {
            res.status(200).json({
                msg: "invalid password",
            });
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Internal server error. Try Again!!",
        });
    }
}

//get user data only after authentication
const getUser = async (req, res) => {
    const user = req.user;

    res.status(200).json({ user });
}

module.exports = {
    registerUser,
    loginUser,
    getUser,
};