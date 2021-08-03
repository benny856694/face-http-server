const express = require('express');
const app = express();
const debug = require('debug')('http');
const volleyball = require('volleyball')

require('debug').enable('http');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(volleyball)

app.get('/', (req, res) => {
    res.json({error: 0, message: ''})
})

app.post('/', (req, res) => {

    res.status(200);
})

const port = 5000;
app.listen(port, () => debug(`server started at ${port}`));