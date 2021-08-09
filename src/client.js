const axios = require('axios')
const debug = require('debug')('http')

require('debug').enable('http');

const fcm = axios.create({
    baseURL: 'https://requestbin.net/r/en4w1rz2'
})

fcm.defaults.headers.common['Authorization'] = "some keys"

fcm.post('', {
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


