const express = require('express');
const uniqid = require('uniqid');
const databaseConnector = require('./database');
const auth = require('./auth');

const router = express.Router();

// TODO: Add authorization

router.get('/', async (req, res) => {
    try {
        auth.decodeToken(req);
        await databaseConnector.sequelize.sync();
        const locations = await databaseConnector.Location.findAll({
            attributes: { exclude: ['userUsername'] },
            raw: true
        });

        res.send(locations);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        let currentuser = await auth.decodeToken(req);
        console.log("the username is " + currentuser.username);
        //console.log("use: is " + use + "user id: " + use.username);
        /*
        if (req.header('Authorization')) {
            console.log("auth is" + req.header('Authorization'));
            var authorization = req.header('Authorization').split('Bearer ').reduce((acc, cur) => cur),

                decoded;
            try {
                decoded = jwt.verify(authorization, secret, function (err, decoded) {
                    if (err) {
                        reject(new Error('Auth token is invalid'));
                    } else {
                        resolve(decoded);
                    }
                });
                 console.log("decoded is "+decoded);
            } catch (e) {
                return res.status(401).send('unauthorized');
            }
            var userId = decoded.id;
            console.log("userId = " + userId);
        }*/

        await databaseConnector.sequelize.sync();


        await databaseConnector.Location.create({
            category: req.body.category,
            name: req.body.name,
            description: req.body.description,
            address: req.body.address,
            city: req.body.city,
            lat: req.body.lat,
            lng: req.body.lng,
            user_id: currentuser.username
            // TODO: User has to added as foreign key
        });

        const loc = req.body.title;

        res.send({
            loc
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
        return;
    }
});

router.get('/:id', async (req, res) => {
    try {
        await databaseConnector.sequelize.sync();
        const location = await databaseConnector.Location.findByPrimary(req.params.id, {
            attributes: { exclude: ['userUsername'] },
            raw: true
        });

        if (!location) {
            return res.send(404, {
                error: `Location(id:${req.params.id}) does not exist`
            })
        }

        res.send(location);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        //TODO: Implement editing functionality of req.params.id
        //TODO: Implement authentification
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        //TODO: Implement deleting functionality of req.params.id
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

module.exports = {
    router
};


