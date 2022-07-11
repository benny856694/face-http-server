const express = require('express');
const debug = require('debug')('http');
const volleyball = require('volleyball')


var servercfg = require('./server_config.json');


const app = express();
app.use(volleyball)
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

for (const s in servercfg) {
    if (Object.hasOwnProperty.call(servercfg, s)) {
        const server = servercfg[s];
        for (let i = 0; i < server.length; ++i) {
            const cfg = server[i];
            debug('url:', cfg.url, '--> data:', cfg.data)
                app.post(cfg.url, (req, res) => {
                    res.json(cfg.data)
                } )
            
        }
       
    }
}


const port = 5000;
app.listen(port, () => debug(`server started at ${port}`));

