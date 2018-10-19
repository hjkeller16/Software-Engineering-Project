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

app.use('/auth', auth.router);

app.use('/data', async (req, res) => {
    let tokenPayload;
    try {
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
    app.use('/', (req, res) => {
        res.header('Location', 'http://localhost:4200');
        res.send(302);
    });
} else {
    app.use('/', express.static(`${__dirname}/public`));
}

app.listen(3000, () => console.log(`Server started.`));