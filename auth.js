const express = require('express');
const jwt = require('jsonwebtoken');
const uniqid = require('uniqid');
const databaseConnector = require('./database');
const emailValidator = require("email-validator");
const router = express.Router();
const secret = uniqid();

router.post('/register', async (req, res) => {
    try {
        await databaseConnector.sequelize.sync();
        const user = await databaseConnector.User.findByPrimary(req.body.username);
        const emailuser = await databaseConnector.User.findAll({where: {email: req.body.email}})
        // Check if user already exists
        if (user) {
            res.status(409).send({ error: 'Username existiert bereits' });
            return;
        }
        if (emailuser.length > 0) {
            res.status(409).send({ error: 'Email existiert bereits' });
            return;
        }
        // Check if user forgot to enter a username or password
        if (!req.body.username || req.body.username == "") {
            res.status(422).send({ error: "please enter username" });
            return;
        }
        if (!req.body.password || req.body.password == "") {
            res.status(422).send({ error: "please enter password" });
            return;
        }
        // Create user
        await databaseConnector.User.create({
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: req.body.password
        });
        // Assign token to user
        const token = jwt.sign({
            username: req.body.username
        }, secret, {
                expiresIn: '2 days'
            }
        );
        res.send({
            token
        });
    } catch (err) {
        res.status(400).send({ error: err.message });
        return;
    }
});

router.post('/login', async (req, res) => {
    try {
        await databaseConnector.sequelize.sync();
        // Verify user input
        let userInput = req.body.username;
        // Test if user input is username or email and get user information
        let user;
        if (emailValidator.validate(userInput)) {
            user = await databaseConnector.User.findOne({
                where: {
                    email: userInput
                }
            });
            //Send username instead of email
            userInput = user ? user.username : null;
        } else {
            user = await databaseConnector.User.findByPrimary(userInput);
        }
        const valid = user && await user.verifyPassword(req.body.password);
        if (!valid) {
            res.status(401).send({ error: 'Login nicht erfolgreich' });
            return;
        }
        // Assign token to user
        const token = jwt.sign({
            username: userInput
        }, secret, {
                expiresIn: '2 days'
            }
        );
        res.send({
            token,
        });
    } catch (err) {
        res.status(400).send({ error: err.message });
        return;
    }
});

router.get('/payload', async (req, res) => {
    try {
        const payload = await decodeToken(req);
        res.send(payload);
    } catch (err) {
        res.status(401).send({ error: err.message });
    }
});

/**
 * Get and verify current token
 * @param {Request} request 
 * @returns {Promise<Object>}
 */
async function decodeToken(request) {
    return new Promise(async (resolve, reject) => {
        let token;
        try {
            token = request.header('Authorization').split('Bearer ').reduce((acc, cur) => cur);
        } catch (err) {
            return reject(new Error('No auth token supplied'));
        }
        jwt.verify(token, secret, function (err, decoded) {
            if (err) {
                reject(new Error('Auth token is invalid'));
            } else {
                resolve(decoded);
            }
        });
    });
}

module.exports = {
    router,
    decodeToken
};