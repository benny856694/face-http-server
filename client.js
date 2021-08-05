const axios = require('axios')
const debug = require('debug')('http')

require('debug').enable('http');

const fcm = axios.create({
    baseURL: 'https://fcm.googleapis.com/fcm/send'
})

fcm.defaults.headers.common['Authorization'] = "AAAA_Vt-h2U:APA91bH9KJRvVL0XL8vxdyAimE1gX_O-GVd4AQnrwFx3Tb6tY0_g9E33pcbaw6MjFpz9Yzt8FOmuD43TAKjjV-Kq0nh9PoXSeyFYCK0hHbLvZv2u8dNbjGL8TWNK8vXmbLzdw-4gQJVb"

fcm.post('/', {
    registration_ids: ['dqZn1Za9Qf6ekVbHobyQDe:APA91bE7rXBiDLxToza_S147MbPRJOTXKfIBDtou5jl1YnfJspA9FhYmketoIkrQkHekvkbjCUnot5zThTri0OKEPvJFt3WBSPMla6kaKzNBsxMJYIFINi9rouJQhEUO1tgOOhJY9rF0'],
    notification: {
        title: "fcm test",
        body: 'fcm body'
    }
})
.then((res) => {
    debug('%s', res.status);
})
.catch((err) => {
    debug('%o', err);
})


