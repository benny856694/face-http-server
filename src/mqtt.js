const debug = require('debug')('mqtt')
require('debug').enable('mqtt');

const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://s1.huaan-smart.com')

let clientId = 'abcd1235'
let topicFaceCaptureReq = `topic/face/capture/request/${clientId}`
let topicFaceCaptureResp = `topic/face/capture/response/${clientId}`

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
    if (topic === topicFaceCaptureReq) {
        var req = JSON.parse(message.toString())
        debug(`face capture(${Date()}):  `, req.sequence_no, req.device_sn, req.cap_time)
        var resp = {
            reply: "ACK",
            cmd: "face",
            code: 0,
            sequence_no: req.sequence_no,
            cap_time: req.cap_time,
        }
        client.publish(topicFaceCaptureResp, JSON.stringify(resp))

    }


})