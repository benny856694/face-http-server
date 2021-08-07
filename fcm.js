if(!process.env.FCM_SERVER_KEY) {
    throw 'Environment variable FCM_SERVER_KEY is not set'
}

const axios = require('axios')
const fcm = axios.create({
    baseURL: 'https://fcm.googleapis.com/fcm/send'
})

fcm.defaults.headers.common['Authorization'] = `key=${process.env.FCM_SERVER_KEY}`

exports.sendTo = function(targetToken) {
    const token = targetToken || 'dqZn1Za9Qf6ekVbHobyQDe:APA91bE7rXBiDLxToza_S147MbPRJOTXKfIBDtou5jl1YnfJspA9FhYmketoIkrQkHekvkbjCUnot5zThTri0OKEPvJFt3WBSPMla6kaKzNBsxMJYIFINi9rouJQhEUO1tgOOhJY9rF0'
    return fcm.post('', {
        registration_ids: [token],
        notification: {
            title: "FCM Test Message",
            body: `Message sent @ ${new Date().toString()}`
        }
    })
}



