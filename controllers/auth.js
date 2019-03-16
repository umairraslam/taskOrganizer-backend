const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const crypto = require('crypto-random-string');
const util = require('../util/util.js');
const SALT_ROUNDS = 10;
const emailService = require('./email');

const generateJwtToken = (user) => {
    let expires = moment().utc().add({ days: 1 }).unix();
    let token = jwt.sign({
        exp: expires,    //expires in 24 hrs
        user: user
    }, process.env.JWT_SECRET);
    return {
        token: token,
        expires: moment.unix(expires).format()
    }
}

let token;

module.exports = {
    async signUp(req, res) {
        try {
            var user = new User();
            user.firstName = req.payload.firstName;
            user.lastName = req.payload.lastName;
            user.role = req.payload.role;
            user.email = req.payload.email;
            user.dob = req.payload.dob;
            
            let hash = await bcrypt.hash(req.payload.password, SALT_ROUNDS);
            user.password = hash;
            let response = await user.save();
            return response;
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
    },
    async authenticate(req, res) {
        try {
            let user = await User.findOne({ email: req.payload.email });
            console.log(user);
            if(user && user.length == 0){
                return res.response({message: "Invalid credentials"}).code(500);
            }
            
            let havePasswordsMatched = await bcrypt.compare(req.payload.password, user.password);
            if(havePasswordsMatched){
                token = generateJwtToken(user);
                return res.response({message: "Authenticated", token: token}).code(200);
            } else{
                return res.response({message: "Invalid credentials"}).code(500);
            }
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
    },
    async forgotPassword(req, res) {
        try{
            let user = await User.findOne({ email: req.payload.email });
            let newToken = crypto(32);
            let payload = {
                token: newToken,
                tokenTimestamp: Date.now()
            };
            let response = await User.update({ _id: user._id }, payload);
            let url = 'http://' + process.env.front_end_host + ':' + process.env.front_end_port + '/resetPassword/' + newToken;
                    let html = `<p>This email has been sent to you because you requested to set a new password. Please click <a href="` + url + `">here</a> to set a new password.
                        <br/><br/>If the link does not work, please copy and paste the following into your internet browser.
                        <br/><br/>
                        `+ url + `
                        <br/><br/>
    
                        <strong>Note: This password reset link is only valid for the next 24 hours.</strong>
    
                        <br/><br/>
    
                        If you did not request a new password, please ignore this email.
                        <br/><br/>
                        Thanks! <br/>
                Support Team
                <br/><br/>
                        +===========================================================+<br/>
                        This email is confidential and may be privileged. If you have received it <br/>
                        in error, please notify us immediately and then delete it. Please do not <br/>
                        copy it, disclose its contents or use it for any purpose.<br/>
                        +===========================================================+
                        </p>`;
                    await emailService.sendEmail(req.payload.email,
                        'Password Reset Request',
                        null, html);

                    return res.response({message: "An email has been sent with Password Reset instructions"}).code(200);
        } catch(err){
            console.log(err);
            throw new Error(err);
        }
    },
    async resetPassword(req, res) {
        try{
            if (!util.isPasswordStrong(req.payload.password)) {
                return res.response({message: "Weak password"}).code(500);
            }

            let user = await User.findOne({token: req.payload.token});

            console.log(user)

            if(!user){
                return res.response({message: "Invalid token"}).code(500);
            }

            let tokents = new Date(user.tokenTimestamp);
            console.log(tokents)
            let timeDiff = Math.abs(new Date().getTime() - tokents.getTime());
            let diffHours = Math.ceil(timeDiff / (1000 * 60 * 60));
            if (diffHours <= parseInt(process.env.token_expiry_hours)) {
                let hash = await bcrypt.hash(req.payload.password, SALT_ROUNDS);
                let payload = {
                    token: null,
                    password: hash,
                    tokenTimestamp: null
                };
                let response = await User.update({ _id: user._id }, payload);
                return res.response({message: "Password changed"}).code(200);
            }else {
                let payload = {
                    token: null,
                    tokenTimestamp: null
                };
                let response = await User.update({ _id: user._id }, payload);
                return res.response({message: "Token expired"}).code(500);
            }
        } catch(err){
            console.log(err);
            throw new Error(err);
        }
    },
    async editProfile(req, res) {
        try{
            let user = await User.findOne({_id: req.params.id});

            console.log(user)

            if(!user){
                return res.response({message: "User not found"}).code(404);
            }
            let payload = {
                firstName: req.payload.firstName,
                lastName: req.payload.lastName,
                email: req.payload.email,
                role: req.payload.role,
                dob: req.payload.dob
            };

            let response = await User.update({ _id: user._id }, payload);
            user = await User.findOne({_id: req.params.id});
            return res.response({message: "User Profile has been updated", user: user}).code(200);

        } catch(err){
            console.log(err);
            throw new Error(err);
        }
    }
}