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
        //debug(server);
        for (const url in server) {
            if (Object.hasOwnProperty.call(server, url)) {
                const element = server[url];
                debug('url:', element.url, 'data:', element.data)
                app.post(element.url, (req, res) => {
                    res.json(element.data)
                } )    
            }
        }
       
    }
}


const port = 5000;
app.listen(port, () => debug(`server started at ${port}`));

