const express = require('express');
const uniqid = require('uniqid');
const databaseConnector = require('./database');
const auth = require('./auth');
var fs = require('fs');
let multer = require('multer');
let upload = multer();
const category = require('./category');

const router = express.Router();

// TODO: Add authorization

router.get('/', async (req, res) => {
    try {
        auth.decodeToken(req);
        await databaseConnector.sequelize.sync();
        const locations = await databaseConnector.Location.findAll({
            //raw: true
        });

        res.send(locations);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

router.post('/image', upload.single('locationImage'), async (req, res) => {
    try {

        let currentuser = await auth.decodeToken(req);
        await databaseConnector.sequelize.sync();

        const location = await databaseConnector.Location.create({
            category_id: req.body.category,
            name: req.body.name,
            description: req.body.description,
            address: req.body.address,
            lat: req.body.lat,
            lng: req.body.lng,
            user_id: currentuser.username,
            image: req.file.buffer
            // TODO: User has to added as foreign key
        }/*, { include: [category] }).then(location=>{
            location.setCategories([1,2])}*/);

        const loc = req.body.title;
        //category.addLocation(location);

        //await databaseConnector.Location.findByPrimary(1).addCategories([1,2]);
        //maybe correct
        /*databaseConnector.Location.findById(1).then(function(project){
            return project.addCategory(1);
            // project will be an instance of Project and stores the content of the table entry
            // with id 123. if such an entry is not defined you will get null
          });*/



        res.send({
            loc
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
        return;
    }
});

router.post('/', async (req, res) => {
    try {

        let currentuser = await auth.decodeToken(req);
        await databaseConnector.sequelize.sync();

        const location = await databaseConnector.Location.create({
            category_id: req.body.category,
            name: req.body.name,
            description: req.body.description,
            address: req.body.address,
            lat: req.body.lat,
            lng: req.body.lng,
            user_id: currentuser.username
            //image: req.file.buffer
            // TODO: User has to added as foreign key
        }/*, { include: [category] }).then(location=>{
            location.setCategories([1,2])}*/);

        const loc = req.body.title;
        //category.addLocation(location);

        //await databaseConnector.Location.findByPrimary(1).addCategories([1,2]);
       // databaseConnector.Location.findById(1).then(function(project){
        //    return project.addCategory(1);
            // project will be an instance of Project and stores the content of the table entry
            // with id 123. if such an entry is not defined you will get null
          //});



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


