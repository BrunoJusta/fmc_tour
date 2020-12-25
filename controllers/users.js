const utilities = require('../utilities/utilities.js')
const users = require("../models/users.js");
const bcrypt = require('bcrypt');
const passport = require('passport');
const facebookStrategy = require('passport-facebook').Strategy;

const login = (req, res) => {

    users.find({
        email: req.body.email
    }, function (err, user) {
        if (err) {
            res.status(400).send(err);
        }

        if (user.length > 0) {
            bcrypt.compare(req.body.password, user[0].password).then(function (result) {
                if (result) {
                    utilities.generateToken({
                        user: req.body.email
                    }, (token) => {
                        res.status(200).json(token);
                    })
                } else {
                    res.status(401).send("Not Authorized");
                }
            });


        } else {
            res.status(401).send("Not Authorized");
        }

    })
}




const loginGoogle = (validToken, res) => {

    users.find({
        email: validToken.email
    }, function (err, user) {
        if (err) {
            res.status(400).send(err);
        }
        if (user.length > 0) {

            res.status(200).json("Logged");
        } else if (user.length == 0) {

            const userToCreate = new users({
                username: validToken.given_name + " " + validToken.family_name,
                password: "",
                email: validToken.email,
                points: 0,
                img: validToken.picture
            });

            userToCreate.save(function (err, newUser) {
                if (err) {
                    res.status(400).send(err);
                }
                res.status(200).json("Registered User");
            })
        } else {
            res.status(401).send("Not Authorized");

        }

    })
}


const register = (req, res) => {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.password, salt, function (err, hash) {

            const userToCreate = new users({
                username: req.body.username,
                password: hash,
                email: req.body.email,
                points: 0,
                img: ""
            });

            users.find({
                email: req.body.email
            }, function (err, user) {
                if (err) {
                    res.status(400).send(err);
                }

                if (user.length > 0) {
                    res.status(406).send("Duplicated User");
                } else {
                    userToCreate.save(function (err, newUser) {
                        if (err) {
                            res.status(400).send(err);
                        }
                        res.status(200).json("Registered User");
                    })
                }
            })
        });
    });
}


const getUsers = (req, res) => {
    users.find(function (err, result) {
        if (err) {
            res.status(400).send(err);
        }
        res.status(200).json(result);
    })
}

/* const loginFacebook = (profile, res) => {
    users.find({
        email: profile.email
    }, function (err, user) {
        if (err) {
            res.status(400).send(err);
        }
        if (user.length > 0) {
            utilities.generateToken({
                user: req.body.email
            }, (token) => {
                res.status(200).json(token);
            })
        } else if (user.length == 0) {

            const userToCreate = new users({
                username: profile.first_name + " " + profile.last_name,
                password: "",
                email: profile.email,
                points: 0,
                img: ""
            });

            userToCreate.save(function (err, newUser) {
                if (err) {
                    res.status(400).send(err);
                }
                res.status(200).json("Registered User");
            })
        } else {
            res.status(401).send("Not Authorized");
        }
    })
} */

//------------------------------------FACEBOOK------------------------------------

passport.serializeUser(function (user, done) {
    done(null, user)
})

passport.deserializeUser(function (obj, done) {
    done(null, obj)
})



passport.use(new facebookStrategy({
    clientID: process.env.FB_ID,
    clientSecret: process.env.FB_SECRET,
    callbackURL: process.env.FB_CALLBACK_URL,
    profileFields: ["email", "name"]
}, function (accessToken, refreshToken, profile, done) {
    console.log('accessToken', accessToken)
    console.log('refreshToken', refreshToken)
    console.log('profile', profile)

    const data = profile._json;

    users.find({
        email: data.email
    }, function (err, user) {
        if (err) {
            res.status(400).send(err);
        }
        if (user.length > 0) {
            utilities.generateToken({
                user: data.email
            }, (token) => {
                done(null, token)
            })
        } else if (user.length == 0) {
            const userToCreate = new users({
                username: data.first_name + " " + data.last_name,
                password: "",
                email: data.email,
                points: 0,
                img: ""
            });

            userToCreate.save(function (err, newUser) {
                if (err) {
                    res.status(400).send(err);
                }
                done(null, newUser)
            })
        } else {
            res.status(401).send("Not Authorized");
        }
    })
}))

//------------------------------------FACEBOOK------------------------------------

exports.login = login;
exports.register = register;
exports.getUsers = getUsers;
exports.loginGoogle = loginGoogle;