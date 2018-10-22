const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const auth = require('./auth');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.url}`);
    next();
});

// Handle request to /auth/* 
app.use('/auth', auth.router);

app.use('/data', async (req, res) => {
    let tokenPayload;
    try {
        // Get data encapsulated in token
        tokenPayload = await auth.decodeToken(req);
    } catch (err) {
        res.status(401).send({ error: err.message });
        return;
    }

    try {
        res.header('Content-Type', 'application/json');
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        // Send response to frontend
        res.send(tokenPayload);
    } catch (err) {
        res.status(500).send(err.message);
        console.error(err.stack);
    }
});

if (process.argv[2] === 'debug') {
    // When in debug mode redirect to angulat development server
    app.use('/', (req, res) => {
        res.header('Location', 'http://localhost:4200');
        res.send(302);
    });
} else {
    // When in productive mode run built angular
    app.use(
        '/', express.static(`${__dirname}/angular/dist`));
}

app.listen(3000, () => console.log(`Server started.`));