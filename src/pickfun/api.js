import express from 'express'
import debug from 'debug'
import crypto from 'crypto'


const pickfun = debug('pickfun');
export const router = express.Router()

let loggedIn = false;
let devices = [
  {
    "liveAble": true,
    "snId": "100",
    "name": "PickFun100",
    "localIp": "192.168.0.100",
    "id": '100',
    "live": false,
    "mac": "xxxx"
  },
  {
    "liveAble": true,
    "snId": "101",
    "name": "PickFun167",
    "localIp": "192.168.0.167",
    "id": '101',
    "live": false,
    "mac": "xxxx"
  },
  {
    "liveAble": true,
    "snId": "102",
    "name": "PickFun168",
    "localIp": "192.168.0.168",
    "id": '102',
    "live": true,
    "mac": "xxxx"
  },
]

// middleware that is specific to this router
router.use((req, res, next) => {
  //console.log('Time: ', Date.now())
  pickfun('request header')
  pickfun('%O', req.headers);
  pickfun('query: %O', req.query);
  next()
})

router.use((req, res, next) => {
  if (!req.path.endsWith('getToken') && !loggedIn) {
    res.status(401).json(
      {
        "code": 401,
        "extraResult": "",
        "data": req.query.uuid,
        "success": true,
        "message": "",
        "timestamp": 0
      }
    )
  } else {
    next()
  }
})

// request token
router.get('/device/MiddleWare/biz/getToken', (req, res) => {
    loggedIn = true;
    res.json({
        "code": 0,
        "extraResult": "",
        "data": req.query.uuid,
        "success": true,
        "message": "",
        "timestamp": 0
    });
})


// logout
router.get('/device/MiddleWare/biz/logout', (req, res) => {
    loggedIn = false;
    res.json({
        "code": 0,
        "extraResult": "",
        "data": req.query.uuid,
        "success": true,
        "message": "",
        "timestamp": 0
    });
})


// device list
router.get('/device/MiddleWare/biz/listLiveDevices', (req, res) => {
  
  res.json({
    "code": 0,
    "extraResult": "",
    "data": devices,
    "success": true,
    "message": "",
    "timestamp": 0
  })
})

//delete device
router.get('/device/MiddleWare/biz/deletedevice', (req, res) => {
  let idx = findIndexOfDevice(req.query.id);
  if (idx !== -1) {
    devices.splice(idx, 1);
    res.json({
      "code": 0,
      "extraResult": "",
      "data": devices,
      "success": true,
      "message": "",
      "timestamp": 0
    })
  } else {
    res.status(404).json({
      "code": 0,
      "extraResult": "",
      "data": devices,
      "success": false,
      "message": "",
      "timestamp": 0
    })
  }
 
})


//report status
router.get('/device/MiddleWare/biz/report', (req, res) => {
  const idx = findIndexOfDevice(req.query.id)
  if (idx === -1) {
    res.status(404).json(
      {
        "code": 404,
        "extraResult": "",
        "data": {},
        "success": false,
        "message": "",
        "timestamp": 0
      }
    )
  } else {
    res.json({
      "code": 0,
      "extraResult": "",
      "data": {},
      "success": true,
      "message": "",
      "timestamp": 0
    })
  }
})


//update ip, id={}&ip={}
router.get('/device/MiddleWare/biz/update', (req, res) => {
  const idx = findIndexOfDevice(req.query.id)
  if (idx === -1) {
    res.status(404).json(
      {
        "code": 404,
        "extraResult": "",
        "data": {},
        "success": false,
        "message": "",
        "timestamp": 0
      }
    )
  } else {
    let dev = devices[idx];
    dev.localIp = req.query.ip;
    res.json({
      "code": 0,
      "extraResult": "",
      "data": dev,
      "success": true,
      "message": "",
      "timestamp": 0
    })
  }
})


//upgrade package
router.get('/device/MiddleWare/biz/getLatestMiddleWareUpgradePackage', (req, res) => {
  res.json({
    "code": 0,
    "extraResult": "",
    "data": {
      "id": "",
      "version": "1.0.0.0",
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


function findIndexOfDevice(id) {
  let idx = devices.findIndex(v => v.id === id);
  return idx;
}

