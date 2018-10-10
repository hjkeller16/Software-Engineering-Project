const express = require('express');

const app = express();

app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.url}`);
    next();
});

app.use('/', express.static(`${__dirname}/public`));

app.use('/GetInfo', async(req, res) => {
      try {
        // Generate answer in natural language
        const infoText = "Info: Today it is sunny.";
        console.log(infoText);
        res.header('Content-Type', 'application/json');
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        // Send response to frontend
        res.send({ info: infoText });
    } catch (err) {
        res.status(500);
        res.send(err.message);
        console.error(err.stack);
    }
});

app.listen(3000, () => console.log(`Server started.`));