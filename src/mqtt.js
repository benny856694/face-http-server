const dayjs = require('dayjs')
const debug = require('debug')('mqtt')
require('debug').enable('mqtt');
const fs = require('fs')

const mqtt = require('mqtt')


let clientId = 'abcd1235'
let topicFaceCaptureReq = `topic/face/capture/request/${clientId}`
let topicFaceCaptureResp = `topic/face/capture/response/${clientId}`

let mqttServer = 'mqtt://47.108.73.83:1883'
let mqttUserName = ''
let mqttPassword = ''

const client = mqtt.connect(mqttServer, {
    username: mqttUserName,
    password: mqttPassword
})

client.on('connect', function () {
    client.subscribe(topicFaceCaptureReq, function (err) {
        if (err) {
            debug(err)
        } else {
            debug('subscribe success')
        }
    })
})

client.on('message', function (topic, message) {
    // message is Buffer
    const json = message.toString()
    var req = JSON.parse(json)

    debug(`topic: ${topic}, message: ${JSON.stringify(req)}`)


    if (topic === topicFaceCaptureReq) {
        //fs.writeFileSync(`./${req.sequence_no}.json`, json)
        //remove a property
        delete req.closeup_pic
        if (req?.match?.image)
            delete req.match.image
        if (req?.overall_pic)
            delete req.overall_pic
        if (!req.is_realtime) {
            //repeat 3 times
            for (let i = 0; i < 3; i++) {
                debug(i == 1 ? ' *************** ' : '')
            }
        }

        debug(`============Seq: ${req.sequence_no}, Realtime: ${req.is_realtime}, CapTime: ${req.cap_time}, LogTime:${new Date()}==================`)
        debug(`face capture(${Date()}):  `, JSON.stringify(req))

        var resp = {
            reply: "ACK",
            cmd: "face",
            code: 0,
            sequence_no: req.sequence_no,
            cap_time: req.cap_time,
        }
        setTimeout(() => {
            client.publish(topicFaceCaptureResp, JSON.stringify(resp))
        }, 1000*1);
        

    }
})