const express = require('express');
const uniqid = require('uniqid');
const databaseConnector = require('./database');

const router = express.Router();

const secret = uniqid();

router.post('/addpoi', async (req, res) => {
    try {
        await databaseConnector.sequelize.sync();
        //const latitude = await databaseConnector.Location.findByPrimary(req.body.lat);
        //const longitude = await databaseConnector.Location.findByPrimary(req.body.long);

        await databaseConnector.Location.create({
            category: req.body.category,
            name: req.body.name,
            description: req.body.description,
            address: req.body.address,
            city: req.body.city,
            lat: req.body.lat,
            long: req.body.long
        });

        const loc = req.body.title;

        res.send({
            loc
        });
    } catch (err) {
        res.status(400).send({ error: err.message });
        return;
    }
});

module.exports = {
    router
};


