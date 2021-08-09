const express = require('express');
const httpDebug = require('debug')('http');
const volleyball = require('volleyball')
const fcm = require('./fcm')
const fcmDebug = require('debug')('fcm')


const app = express();
app.use(volleyball)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.get('/', (req, res) => {
    res.json({error: 0, message: 'well done!'})
})


app.get('/fcm/send', async(req, res) => {
    try {
        const resp = await fcm.sendTo()
        fcmDebug('%O', resp)
        res.sendStatus(resp.status)
    } catch (err) {
        fcmDebug('%O', err.response)
        if(err.response) {
            res.sendStatus(err.response.status)
        } else {
            res.status(500).send(err.message)
        }
    }
})

app.post('/upload/record', (req, res) => {
    req.body.closeup_pic = "removed";
    req.body.match && (req.body.match.image = "removed");
    httpDebug(`===============Receive: ${req.body.sequence_no}==================`)
    httpDebug("body: %O", req.body);
    var result = { reply: "ACK", cmd: "face", code: 0};
    result.cap_time = req.body.cap_time;
    result.sequence_no = req.body.sequence_no;
    httpDebug("res: %O", result);  
    res.json(result);  
 
})

const port = 5000;
app.listen(port, () => httpDebug(`server started at ${port}`));