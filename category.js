const express = require('express');
const databaseConnector = require('./database');
const auth = require('./auth');
const router = express.Router();
const category = require('./category');


router.get('/', async (req, res) => {
    try {
        auth.decodeToken(req);
        await databaseConnector.sequelize.sync();
        const categories = await databaseConnector.Category.findAll({
            attributes: {  },
            raw: true
        });

        res.send(categories);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        await databaseConnector.sequelize.sync();

        await databaseConnector.Category.create({
            category: req.body.category,
            //locations: [{location_id: 1}, {location_id: 2}]

        })/*.then(function (category) {
            category.setLocations(req.body.locations);
            
        })*/;
        //category.addLocation(locations);
        //category.setLocations([1, 2]);

        const cat = req.body.title;

        res.send({
            cat
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
        return;
    }
});


router.get('/:id', async (req, res) => {
    try {
        await databaseConnector.sequelize.sync();
        const category = await databaseConnector.Category.findByPrimary(req.params.id, {
            attributes: {  },
            raw: true
        });

        if (!category) {
            return res.send(404, {
                error: `Category(id:${req.params.id}) does not exist`
            })
        }
        res.send(category);
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