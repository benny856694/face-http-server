const express = require('express');
const httpDebug = require('debug')('http');
const volleyball = require('volleyball')
const fcm = require('./fcm')
const fcmDebug = require('debug')('fcm')


const app = express();
app.use(volleyball)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var start = Date.now()

function msToTime(ms) {
    let seconds = (ms / 1000).toFixed(1);
    let minutes = (ms / (1000 * 60)).toFixed(1);
    let hours = (ms / (1000 * 60 * 60)).toFixed(1);
    let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
    if (seconds < 60) return seconds + " Sec";
    else if (minutes < 60) return minutes + " Min";
    else if (hours < 24) return hours + " Hrs";
    else return days + " Days"
  }

app.get('/', (req, res) => {
    res.json({error: 0, message: 'well done!', running: `${msToTime(Date.now()-start)}`})
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


app.post('/net', (req, res) => {
    req.body.closeup_pic = "removed";
    req.body.match && (req.body.match.image = "removed");
    httpDebug(`===============Receive: ${req.body.sequence_no}==================`)
    httpDebug("body: %O", req.body);
    var result = { code: 200, message: "success" };
    result.cap_time = req.body.cap_time;
    result.sequence_no = req.body.sequence_no;
    httpDebug("res: %O", result);  
    res.json(result);  
 
})


const port = 5001;
app.listen(port, () => httpDebug(`server started at ${port}`));