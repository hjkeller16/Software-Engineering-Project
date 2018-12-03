const express = require('express');
const databaseConnector = require('./database');
const auth = require('./auth');
var Sequelize = require('sequelize');


const router = express.Router();

// TODO: Add authorization

router.get('/', async (req, res) => {
    try {
        auth.decodeToken(req);
        await databaseConnector.sequelize.sync();
        const locations = await databaseConnector.Location.findAll({
            attributes: { exclude: ['image'] },
            raw: true
        });

        res.send(locations);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        console.log("the body is " + JSON.stringify(req.body));
        let currentuser = await auth.decodeToken(req);
        console.log("the username is " + currentuser.username);

        if (req.body.category == "") {
            res.status(422).send({ error: "please enter category" });
            return;
        }

        // Connect to database
        await databaseConnector.sequelize.sync();
        // Create table
        await databaseConnector.Location.create({
            // category_id: req.body.category,
            category: req.body.category,
            name: req.body.name,
            description: req.body.description,
            address: req.body.address,
            lat: req.body.lat,
            lng: req.body.lng,
            user_id: currentuser.username,
            image: req.body.image
        });
        res.send();
    } catch (err) {
        res.status(500).send({ error: err.message });
        return;
    }
});

router.post('/search', async (req, res) => {
    try {
        // Test: send empty array back
        const Op = Sequelize.Op;
        const beginning = req.body.address + "%";
        const end = "%" + req.body.address;
        const middle = "%" + req.body.address + "%";
        const arraysize = req.body.categories.length;

        var addressLocations;
        
        if(arraysize > 0){
             addressLocations = await databaseConnector.Location.findAll({
                 where: {
                    [Op.or]: [
                        {
                            address: {
                                [Op.like]: beginning
                            }
                        },{
                            address: {
                                [Op.like]: middle
                            }
                        },{
                            address: {
                                [Op.like]: end
                            }
                        }
                    ], [Op.and]: [
                        { [Op.or]: 
                            [{
                                category: {
                                    [Op.like]: { [Op.any]: req.body.categories} 
                                }
                            }]
                        }
                    ]
                }
            });
        }

        if (arraysize === 0){
             addressLocations = await databaseConnector.Location.findAll({
                where: {
                    [Op.or]: [
                        {
                            address: {
                                [Op.like]: beginning
                            }
                        },{
                            address: {
                                [Op.like]: middle
                            }
                        },{
                            address: {
                                [Op.like]: end
                            }
                        }
                    ]
                }
            });

        }

        res.send(addressLocations);
    } catch (err) {
        res.status(500).send({ error: err.message });
        return;
    }
});

router.get('/:id', async (req, res) => {
    try {
        await auth.decodeToken(req);
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
