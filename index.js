const express = require('express');
const debug = require('debug')('http');
const volleyball = require('volleyball')
const axios = require('axios')

require('debug').enable('http');

if(!process.env.FCM_SERVER_KEY) {
    console.log('Environment variable FCM_SERVER_KEY is not set')
    process.exit(1)
}


const fcm = axios.create({
    baseURL: 'https://fcm.googleapis.com/fcm/send'
})

fcm.defaults.headers.common['Authorization'] = `key=${process.env.FCM_SERVER_KEY}`


const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(volleyball)

app.post('/', (req, res) => {
    res.json({error: 0, message: 'well done!'})
})


app.get('/fcm/send', async(req, res) => {
    try {
        const resp = await fcm.post('', {
            registration_ids: ['dqZn1Za9Qf6ekVbHobyQDe:APA91bE7rXBiDLxToza_S147MbPRJOTXKfIBDtou5jl1YnfJspA9FhYmketoIkrQkHekvkbjCUnot5zThTri0OKEPvJFt3WBSPMla6kaKzNBsxMJYIFINi9rouJQhEUO1tgOOhJY9rF0'],
            notification: {
                title: "FCM Test Message",
                body: `Message sent @ ${new Date().toString()}`
            }
        })
        
        res.sendStatus(resp.status)
    } catch (err) {
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
    debug(`===============Receive: ${req.body.sequence_no}==================`)
    debug("body: %o", req.body);
    var result = { reply: "ACK", cmd: "face", code: 0};
    result.cap_time = req.body.cap_time;
    result.sequence_no = req.body.sequence_no;
    debug("res: %o", result);  
    res.json(result);  
 
})

const port = 5000;
app.listen(port, () => debug(`server started at ${port}`));