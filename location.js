const express = require('express');
const databaseConnector = require('./database');
const auth = require('./auth');
const seq = require('sequelize');
const router = express.Router();
const sharp = require('sharp');

router.get('/', async (req, res) => {
    try {
        await auth.decodeToken(req);
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

async function resizeImage(dataUri) {
    const imageBuffer = Buffer.from(dataUri.split(';base64,').pop(), 'base64');
    const image = sharp(imageBuffer);
    const resizedBuffer = await image.resize(500).toBuffer();
    return dataUri.split(';base64,')[0] + ';base64,' + resizedBuffer.toString('base64');
}

router.post('/', async (req, res) => {
    try {
        let currentuser = await auth.decodeToken(req);
        // check that category, name, and address are filled out (mandatory fields)
        if (!req.body.category || req.body.category == "") {
            res.status(422).send({ error: "please enter category" });
            return;
        }
        if (!req.body.name || req.body.name == "") {
            res.status(422).send({ error: "please enter name" });
            return;
        }
        if (!req.body.address || req.body.address == "") {
            res.status(422).send({ error: "please enter address" });
            return;
        }
        if (req.body.image) {
            req.body.image = await resizeImage(req.body.image);
        }
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
        await auth.decodeToken(req);
        await databaseConnector.sequelize.sync();const Op = seq.Op;
        const beginning = req.body.address + "%";
        const end = "%" + req.body.address;
        const middle = "%" + req.body.address + "%";
        const arraysize = req.body.categories.length;
        let addressLocations;

        //search for locations based on text field (name and address) and category
        if (arraysize > 0) {
            addressLocations = await databaseConnector.Location.findAll({
                attributes: { exclude: ['image'] },
                where: {
                    // check for locations with the entered string at the beginning, middle, or end or the location's name or address
                    [Op.or]: [
                        {
                            address: {
                                [Op.like]: beginning
                            }
                        }, {
                            address: {
                                [Op.like]: middle
                            }
                        }, {
                            address: {
                                [Op.like]: end
                            }
                        }, {
                            name: {
                                [Op.like]: end
                            }
                        }, {
                            name: {
                                [Op.like]: middle
                            }
                        }, {
                            name: {
                                [Op.like]: beginning
                            }
                        }
                    ], [Op.and]: [
                        //check for locations with the entered categories
                        {
                            [Op.or]:
                                [{
                                    category: {
                                        [Op.like]: { [Op.any]: req.body.categories }
                                    }
                                }]
                        }
                    ]
                }
            });
        }
        //search for locations based on text field (name and address)
        if (arraysize === 0) {
            addressLocations = await databaseConnector.Location.findAll({
                attributes: { exclude: ['image'] },
                where: {
                    // check for locations with the entered string at the beginning, middle, or end or the location's name or address
                    [Op.or]: [
                        {
                            address: {
                                [Op.like]: beginning
                            }
                        }, {
                            address: {
                                [Op.like]: middle
                            }
                        }, {
                            address: {
                                [Op.like]: end
                            }
                        }, {
                            name: {
                                [Op.like]: end
                            }
                        }, {
                            name: {
                                [Op.like]: middle
                            }
                        }, {
                            name: {
                                [Op.like]: beginning
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
        // check whether the id entered corresponds to a location in the database
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

router.delete('/:id', async (req, res) => {
    try {
        let currentuser = await auth.decodeToken(req);
        await databaseConnector.sequelize.sync();
        const location = await databaseConnector.Location.find({
            where: {
                id: req.params.id,
            },
            raw: true
        });
        // check whether the id entered corresponds to a location in the database
        if (!location) {
            return res.send(404, {
                error: `Location(id:${req.params.id}) does not exist`
            })
        }
        // check if user is allowed to delete location
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