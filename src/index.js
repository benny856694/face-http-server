const express = require('express');
const httpDebug = require('debug')('http');
const volleyball = require('volleyball')

const fcmDebug = require('debug')('fcm')


const app = express();
app.use(volleyball)
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

var start = Date.now()

//convert millisecond to human-readable string
function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = parseInt((duration / 1000) % 60),
        minutes = parseInt((duration / (1000 * 60)) % 60),
        hours = parseInt((duration / (1000 * 60 * 60)) % 24);
        return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}


app.get('/', (req, res) => {
    res.json({
        error: 0,
        message: 'well done!',
        running: `${msToTime(Date.now()-start)}`
    })
})




app.post('/upload/record', (req, res) => {
    req.body.closeup_pic = "removed";
    req.body.match && (req.body.match.image = "removed");
    httpDebug(`===============Receive: ${req.body.sequence_no}==================`)
    httpDebug("body: %O", req.body);
    var result = {
        reply: "ACK",
        cmd: "face",
        code: 0
    };
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
    var result = {
        code: 200,
        message: "success"
    };
    result.cap_time = req.body.cap_time;
    result.sequence_no = req.body.sequence_no;
    httpDebug("res: %O", result);
    res.json(result);

})



function timestamp() {
    var d = new Date();
    return d.getTime();
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDate() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}


const healthCode = ["00", "00", "00",  "00", "00"];
const statusCode = [200, 200, 200, 500];
const errorMessages = ["Success", "Chiến dịch thành công"];
const reasons = ["some reason1", "some reason2"];
const cities = ["", "some cities"];
var statusCodeIndex = 0;
var healthCodeIndex = 0;

app.post('/qrcode/login', (req, res) => {
    res.json({
        "success": true,
        "message": "success",
        "code": 200,
        "result": {
            "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwMTIzNzktMTg0MjZCLUEwRkNFRSIsImlhdCI6MTYyODI0MjQ4MCwiZXhwIjoxNjI4MjQ5NjgwfQ.Gknct6XlTgYK_gCXjRqwH-mF5TqaUHLfJ_8GTPyTF8fuBOKsjAagwZBGBJn08MIuI5dn65euqzBjwXekCplaZw"
        },
        "timestamp": timestamp()
    })
})


app.post('/qrcode/id', (req, res) => {
    let code = statusCode[statusCodeIndex++%statusCode.length];
    let message = code === 200 ? errorMessages[0] : errorMessages[1]
    let reason = reasons[random(0, 1)]
    let city = cities[random(0, 1)]
    res.json({
        "success": true,
        "message": message,
        "code": code,
        "result": {
            "date": getDate(),
            "reason": reason,
            "stopOverCity": city,
            "name": "Wang*",
            "id": "5119**********0031",
            "status": healthCode[healthCodeIndex++%healthCode.length],
        },
        "timestamp": timestamp()
    })
})

app.post("/qrcode/code", (req, res) => {
    let code = statusCode[statusCodeIndex++%statusCode.length];
    let message = code === 200 ? errorMessages[0] : errorMessages[1]
    let reason = reasons[random(0, 1)]
    let city = cities[random(0, 1)]
    res.json({
        "success": true,
        "message": message,
        "code": code,
        "result": {
            "date": getDate(),
            "reason": reason,
            "stopOverCity": city,
            "name": "Wang*",
            "id": "5119**********0031",
            "status": healthCode[healthCodeIndex++%healthCode.length],
        },
        "timestamp": timestamp()
    })
})





const port = 5050;
app.listen(port, () => httpDebug(`server started at ${port}`));