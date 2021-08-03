const express = require('express');
const app = express();
const debug = require('debug')('http');
const volleyball = require('volleyball')

require('debug').enable('http');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(volleyball)

app.get('/', (req, res) => {
    res.json({error: 0, message: 'weldone'})
})

app.post('/upload/record', (req, res) => {
    debug("seq: %s", req.body.sequence_no);
    var result = { reply: "ACK", cmd: "face", code: 0};
    result.cap_time = req.body.cap_time;
    result.sequence_no = req.body.sequence_no;
    debug("res: %o", result);  
    res.json(result);  
 
})

const port = 5000;
app.listen(port, () => debug(`server started at ${port}`));