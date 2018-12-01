const express = require('express');
const uniqid = require('uniqid');
const databaseConnector = require('./database');
const auth = require('./auth');
var fs = require('fs');
let multer = require('multer');
let upload = multer();

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

router.post('/', upload.single('locationImage'), async (req, res) => {
    try {
        console.log("the body is " + JSON.stringify(req.body));
        console.log("the body is " + JSON.stringify(req.file));
        let currentuser = await auth.decodeToken(req);
        console.log("the username is " + currentuser.username);

        // Connect to database
        await databaseConnector.sequelize.sync();
        // Create table
        await databaseConnector.Location.create({
            category: req.body.category,
            name: req.body.name,
            description: req.body.description,
            address: req.body.address,
            lat: req.body.lat,
            lng: req.body.lng,
            user_id: currentuser.username
            //image: req.file.buffer
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


