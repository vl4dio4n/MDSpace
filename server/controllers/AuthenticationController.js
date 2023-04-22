const express = require('express');
const crypto = require('crypto'); 

const { User } = require('../models/User');
const { CustomError } = require('../utils/Error');
const { globals } = require('../global-variables');


class AuthenticationController{
    static serverPassword = globals.serverPassword;

    static async register(req, res, next){
        const username = req.body.username.trim();
        const email = req.body.email.trim();
        const password = req.body.password.trim();
        const description = req.body.description.trim();

        if(username == "" || email == "" || password == ""){
          const error = new CustomError('RequiredFieldEmpty', "Please provide all required fields with data");
          return res.json({error, content: undefined});
        }

        let user = await User.findOne({ where: {email: email}});
        if(user) {
            const error = new CustomError('EmailAlreadyExists', 'This email is already taken. Please provide a different email address.');
            return res.json({error, content: undefined});
        }
        
        user = await User.findOne({where: {username: username}});
        if(user) {
            const error = new CustomError('UsernameAlreadyExists', 'This username is already taken. Please choose another one.');
            return res.json({error, content: undefined});
        }

        try{
            let encryptedPassword = crypto.scryptSync(password, AuthenticationController.serverPassword, 64).toString("hex");
            user = new User({username, email, password: encryptedPassword, description});
            await user.save();

            const sessionUser = {
                username: username,
                email: email,
                description: description
            }
            req.session.user = sessionUser;

            return res.status(200).json({error: undefined, content: sessionUser})
        } catch (err) {
            const error = new CustomError('CannotCreateUser', "Registration failed. Please try again.");
            return res.json({error, content: undefined});
        }
    }

    static async signin(req, res, next){
        const username = req.body.username;
        const password = req.body.password;

        try{
            let encryptedPassword = crypto.scryptSync(password, AuthenticationController.serverPassword, 64).toString('hex');
            const user = await User.findOne({where: {username: username, password: encryptedPassword}});
            
            if(!user){
                const error = new CustomError('InvalidCredentials', "Password or username may be wrong. Try again.");
                return res.json({error, content: undefined});
            }

            const sessionUser = {
                username: user.username,
                email: user.email,
                description: user.description
            }
            req.session.user = sessionUser;

            return res.status(200).json({error: undefined, content: sessionUser})
        } catch (err){
            const error = new CustomError('CannotSignIn', "Sign in failed. Please try again.");
            return res.json({error, content: undefined});
        }
    }


    static isAuthenticated(req, res, next){
        if(req.session.user){
            next();
        } else {
            const error = new CustomError('Unauthenticated', "You are not signed in.");
            return res.json({error, content: undefined});
        }
    }

    static signout(req, res, next){
        req.session.destroy((err) => {
            if(err) {
                const error = new CustomError('CannotSignOut', "Sign out failed.");
                return res.json({error, content: undefined});
            }
            return res.status(200).json({error: undefined, content: undefined});
        });
    }

    static getSessionUser(req, res, next){
        return res.status(200).json({ error: undefined, content: req.session.user });
    }
}

module.exports = {AuthenticationController};