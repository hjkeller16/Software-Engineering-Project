const express = require('express');
const databaseConnector = require('./database');
const auth = require('./auth');
const router = express.Router();
const location = require('./location');
const Sequelize = require('sequelize');

router.get('/', async (req, res) => {
    try {
        await auth.decodeToken(req);
        await databaseConnector.sequelize.sync();
        const comments = await databaseConnector.Comment.findAll({
            attributes: {},
            raw: true
        });

        res.send(comments);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        let currentuser = await auth.decodeToken(req);
        await databaseConnector.sequelize.sync();

        await databaseConnector.Comment.create({
            rating: req.body.rating,
            content: req.body.content,
            user_id: currentuser.username,
            location_id: req.body.location_id
        });

        const avgrate = await databaseConnector.Comment.findAll({
            attributes: [[Sequelize.fn('AVG', Sequelize.col('rating')), 'avgrating']],
            where: {
                location_id: req.body.location_id
            }
        })

        await databaseConnector.Location.update(
            { avgrating: avgrate[0].dataValues.avgrating },
            { where: { id: req.body.location_id } }
        ).then(() => {

        });
        await databaseConnector.sequelize.sync();
        res.send();
    } catch (err) {
        res.status(500).send({ error: err.message });
        return;
    }
});


router.get('/:locationid', async (req, res) => {
    try {
        await auth.decodeToken(req);
        await databaseConnector.sequelize.sync();
        const comment = await databaseConnector.Comment.findAll({
            where: {

                location_id: req.params.locationid
            }
        });
        if (!comment) {
            return res.send(404, {
                error: `Comment(id:${req.params.locationid}) does not exist`
            })
        }
        res.send(comment);
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
