const User = require('../models/User');
const Course = require('../models/Course');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

let refreshTokens = [];


const autherController = {

    register: async (req, res) => {
        res.render('auth/register');
    },

    //Register
    registerUser: async (req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            //Create new user
            const newUser = await new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
            });

            //Save to DB
            const user = await newUser.save();
            res.redirect('/auth/login');
            // res.status(200).json(user)
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //Generate access token
    generateAccessToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                admin: user.admin,
            },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: "60s" }
        );
    },

    //Generate refresh token
    generateRefreshToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                admin: user.admin,
            },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: "365d" }
        );
    },

    login: async (req, res) => {
        res.render('auth/login');
    },

    //LOGIN 
    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username });
            if (!user) {
                res.status(404).json("Wrong password");
                res.redirect('/login', alert("Tài khoản hoạc mật khẩu không chính xác"));

            }
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            )
            if (!validPassword) {
                res.status(404).json("Wrong password");
            }
            if (user && validPassword) {
                const accessToken = autherController.generateAccessToken(user);
                const refreshToken = autherController.generateRefreshToken(user);
                refreshTokens.push(refreshToken);
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                })
                const { password, ...others } = user._doc;
                res.render('partials/header', { userName: req.body.username });
                // res.status(200).json({ ...others, accessToken });
            }
        } catch (err) {
            res.status(500).json(err)
        }
    },


    //Redis
    requestRefreshToken: async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json("You're not authenticated");
        if (!refreshTokens.includes(refreshToken)) {
            res.status(403).json("RefreshToken is not valid");
        }
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
            if (err) {
                consol.log(err);
            }
            refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
            //Create new accesstoken and refreshtoken
            const newAccessToken = autherController.generateAccessToken(user);
            const newRefreshToken = autherController.generateRefreshToken(user);
            refreshTokens.push(newAccessToken);
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });
            res.status(200).json({ accessToken: newAccessToken });
        })
    },

    //Logout
    userLogout: async (req, res) => {
        res.clearCookie("refreshToken");
        refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken);
        res.status(200).json("User logout success!")
    },

    //newUserCourse test 
    newUserCourse: async (req, res, next) => {
        //Tim id cua user de tao duong dan localhost../id
        const { userId } = req.params

        //Tao khoa hoc moi
        const newCourse = new Course(req.body)
        console.log('1 ', newCourse)
        //Get user
        const user = await User.findById(userId)
        console.log('user: ', user)
        //Asign user as a courses owner
        newCourse.owner = user

        //Save the course
        await newCourse.save()
        console.log('2 ', newCourse)

        //add course to users array 'courses'
        user.courses.push(newCourse._id)

        //save use
        await user.save()


        return res.status(201).json({ course: newCourse })

    }
};

module.exports = autherController;