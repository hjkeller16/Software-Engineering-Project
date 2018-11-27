const express = require('express');
const databaseConnector = require('./database');
const auth = require('./auth');
const router = express.Router();
const location = require('./location');



router.get('/', async (req, res) => {
    try {
        auth.decodeToken(req);
        await databaseConnector.sequelize.sync();
        const comments = await databaseConnector.Comment.findAll({
            attributes: {  },
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
            location_id: req.body.location
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
        const comment = await databaseConnector.Comment.findByPrimary(req.params.id, {
            attributes: {  },
            raw: true
        });

        if (!comment) {
            return res.send(404, {
                error: `Comment(id:${req.params.id}) does not exist`
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