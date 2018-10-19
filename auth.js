const express = require('express');
const jwt = require('jsonwebtoken');
const uniqid = require('uniqid');
const databaseConnector = require('./database');

const router = express.Router();

const secret = uniqid();

router.post('/register', async (req, res) => {
    try {
        await databaseConnector.sequelize.sync();
        const user = await databaseConnector.User.findByPrimary(req.body.username);

        if (user) {
            res.status(409).send({ error: 'Username already exists' });
            return;
        }

        await databaseConnector.User.create({
            username: req.body.username,
            password: req.body.password
        });
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

        const user = await databaseConnector.User.findByPrimary(req.body.username);
        const valid = user && await user.verifyPassword(req.body.password);

        if (!valid) {
            res.status(401).send({ error: 'Login unsuccessful' });
            return;
        }

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

router.get('/payload', async (req, res) => {
    try {
        const payload = await decodeToken(req);
        res.send(payload);
    } catch (err) {
        res.status(401).send({ error: err.message });
    }
});

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