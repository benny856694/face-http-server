import express from 'express'
import debug from 'debug'
import crypto from 'crypto'


const pickfun = debug('pickfun');
export const router = express.Router()

// middleware that is specific to this router
router.use((req, res, next) => {
  //console.log('Time: ', Date.now())
  pickfun('request header')
  pickfun('%O', req.headers);
  pickfun('query: %O', req.query);
  next()
})
// define the home page route
router.get('/device/MiddleWare/biz/getToken', (req, res) => {
    
    res.json({
        "code": 0,
        "extraResult": "",
        "data": req.query.uuid,
        "success": true,
        "message": "",
        "timestamp": 0
    });
})
// define the about route
router.get('/device/MiddleWare/biz/listLiveDevices', (req, res) => {
  
  res.json({
    "code": 0,
    "extraResult": "",
    "data": [
      {
        "liveAble": true,
        "snId": "xxxx",
        "name": "PickFun",
        "localIp": "192.168.0.100",
        "id": '100',
        "live": true,
        "mac": "xxxx"
      },
      {
        "liveAble": true,
        "snId": "xxxx",
        "name": "PickFun",
        "localIp": "192.168.0.167",
        "id": '101',
        "live": false,
        "mac": "xxxx"
      }
    ],
    "success": true,
    "message": "",
    "timestamp": 0
  })
})

router.get('/device/MiddleWare/biz/report', (req, res) => {
  res.json({
    "code": 0,
    "extraResult": "",
    "data": {},
    "success": true,
    "message": "",
    "timestamp": 0
  })
})

router.get('/device/MiddleWare/biz/getLatestMiddleWareUpgradePackage', (req, res) => {
  res.json({
    "code": 0,
    "extraResult": "",
    "data": {
      "id": "",
      "version": "1.0.5.0",
      "mandatory": {
        "mode": 0,
        "value": false
      },
      "url": "http://localhost:5050/installer.exe"
    },
    "success": true,
    "message": "",
    "timestamp": 0
  })
})


