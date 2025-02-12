const fs = require('fs')
const debug = require('debug')('fcm')
const {
  JWT
} = require('google-auth-library')



const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: {
    service: 'user-service'
  },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({
      filename: './log/error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: './log/combined.log'
    }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}



var keys = null
var fcm = null

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  throw new Error("Environment variable GOOGLE_APPLICATIN_CREDENTIALS is not set")
}

async function getToken() {
  keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS
  debug('%s', keyFile)
  buffer = fs.readFileSync(keyFile)
  keys = JSON.parse(buffer)
  logger.info(keys)
  const client = new JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/firebase.messaging'],
    null
  )

  const res = await client.authorize()
  debug('response: %O', res)
  //const tokenInfo = await client.getTokenInfo(res.access_token)
  //debug('tokenInfo: %O', tokenInfo)
  return res
}

function authorize(params) {
  getToken()
    .then((credientials) => {
      fcm = require('axios').default.create({
        baseURL: `https://fcm.googleapis.com/v1/projects/${keys.project_id}/messages:send`,
        headers: {
          Authorization: `Bearer ${credientials.access_token}`
        }
      })

      const timeOut = credientials.expiry_date - Date.now()
      const threeMinutesPrior = timeOut - 3 * 60 * 1000
      const twoMinutesPrior = timeOut - 2 * 60 * 1000

      setTimeout(() => {
        sendTo(null, 'Token will be refreshed in 1 minutes')
      }, threeMinutesPrior)

      setTimeout(() => {
        authorize()
      }, twoMinutesPrior)

      sendTo(null, `espires at: ${new Date(credientials.expiry_date)}, refresh at ${new Date(Date.now() + twoMinutesPrior)}`)

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