const express = require('express');
const uniqid = require('uniqid');
const databaseConnector = require('./database');

const router = express.Router();

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
        res.status(500).send({ error: err.message });
        return;
    }
});


router.get('/getpoi', async (req, res) => {
    try {
        await databaseConnector.sequelize.sync();
        const poi = await databaseConnector.Location.findAll({
            attributes: { exclude: ['userUsername'] },
            raw: true,
        });
        
        res.send(poi);
    } catch (err) {
        res.status(401).send({ error: err.message });
    }
});

module.exports = {
    router
};


