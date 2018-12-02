const express = require('express');
const databaseConnector = require('./database');
const auth = require('./auth');
let multer = require('multer');
let upload = multer();


const router = express.Router();

// TODO: Add authorization

router.get('/', async (req, res) => {
    try {
        auth.decodeToken(req);
        await databaseConnector.sequelize.sync();
        const locations = await databaseConnector.Location.findAll({
            raw: true
        });

        res.send(locations);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

router.post('/', upload.single('locationImage'), async (req, res) => {
    try {
        let currentuser = await auth.decodeToken(req);

        if (req.body.category == "") {
            res.status(422).send({ error: "please enter category" });
            return;
        }

        // Connect to database
        await databaseConnector.sequelize.sync();
        // Create table
        const location1 = {
            // category_id: req.body.category,
            category: req.body.category,
            name: req.body.name,
            description: req.body.description,
            address: req.body.address,
            lat: req.body.lat,
            lng: req.body.lng,
            user_id: currentuser.username,
            //image: req.body.image
        };

        if(req.file != null){
            location1.image = req.file.buffer;
         };
         const location = await databaseConnector.Location.create(location1
            /*, { include: [category] }).then(location=>{
            location.setCategories([1,2])}*/);





        res.send();
    } catch (err) {
        res.status(500).send({ error: err.message });
        return;
    }
});

router.get('/:id', async (req, res) => {
    try {
        await databaseConnector.sequelize.sync();
        const location = await databaseConnector.Location.findByPrimary(req.params.id, {
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
        let currentuser = await auth.decodeToken(req);
        // Find out if user is allowed to delete location
        const location = await databaseConnector.Location.find({
            where: {
                id: req.params.id,
            },
            raw: true
        });
        if (!location) {
            return res.send(404, {
                error: `Location(id:${req.params.id}) does not exist`
            })
        }
        if (location.user_id != currentuser.username) {
            return res.send(403, {
                error: `User is not authorized to delete location(id:${req.params.id})`
            })
        }
        // Connect to database
        await databaseConnector.sequelize.sync();
        // Delete location object
        await databaseConnector.Location.destroy(
            { where: { id: req.params.id } }
        );
        res.send();
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

module.exports = {
    router
};
