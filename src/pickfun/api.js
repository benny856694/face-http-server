import express from 'express'
export const router = express.Router()

// middleware that is specific to this router
router.use((req, res, next) => {
  //console.log('Time: ', Date.now())
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
router.get('/about', (req, res) => {
  res.send('About birds')
})


