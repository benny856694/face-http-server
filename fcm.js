const debug = require('debug')('fcm')
const {JWT} = require('google-auth-library')

var keys = null
var fcm = null

if(!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    throw new Error("Environment variable GOOGLE_APPLICATIN_CREDENTIALS is not set")
}

async function getToken() {
    keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS
    debug('%s', keyFile)
    keys = require(keyFile)
    debug('%O', keys)
    const client = new JWT(
      keys.client_email,
      null,
      keys.private_key,
      ['https://www.googleapis.com/auth/firebase.messaging'],
      null
      )

    const res = await client.authorize()
    debug('response: %O', res)
    const tokenInfo = await client.getTokenInfo(res.access_token)
    debug('tokenInfo: %O', tokenInfo)
    return res
}

function authorize(params) {
    getToken()
    .then((credientials) => {
        fcm = require('axios').default.create({
            baseURL: `https://fcm.googleapis.com/v1/projects/${keys.project_id}/messages:send`,
            headers: {Authorization: `Bearer ${credientials.access_token}`}
        })

        const timeOut = credientials.expiry_date - Date.now() - 3*60*1000
        setTimeout(()=>{
            sendTo('Token will expire in 1 minutes')
            authorize() 
        }, timeOut)
        debug(`token espires at: ${new Date(credientials.expiry_date)} will be refreshed at ${new Date(Date.now() + timeOut)}`)

    })
    .catch((err) => {
        debug('%O', err)
        throw err
    })
}

authorize()


function sendTo(token, msg) {
    token = token || 'dqZn1Za9Qf6ekVbHobyQDe:APA91bE7rXBiDLxToza_S147MbPRJOTXKfIBDtou5jl1YnfJspA9FhYmketoIkrQkHekvkbjCUnot5zThTri0OKEPvJFt3WBSPMla6kaKzNBsxMJYIFINi9rouJQhEUO1tgOOhJY9rF0'
    return fcm.post('', {
        message: {
          token: token,
          notification: {
            title: "FCM Test",
            body: msg || `message sent @ ${new Date().toLocaleTimeString()}`
          },
          data: {
            "story_id": "story_12345"
          }
        }
    })
}

exports.sendTo = sendTo



