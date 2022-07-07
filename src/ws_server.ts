// @ts-check

interface Command {
    cmd: string;
    command_id: string;
}

interface Reply {
    success: boolean;
    message?: string;
    data?: any;
}

interface Request {
    servercmd: "send to device";
    device_sn: string;
    command: Command;
}


import { WebSocketServer, WebSocket } from 'ws'
const debug = require('debug')('ws_server')

const wss = new WebSocketServer({
    port: 8080,
    clientTracking: true
});

const clients: WebSocket[] = [];
const pendingRequests: WebSocket[] = [];

wss.on('connection', function connection(ws) {
    
    ws.on('message', function message(data) {

        debug('received: %s', data);
        var command = JSON.parse(data.toString());

        //command from device
        if (command.cmd) {
            switch (command.cmd) {
                case 'heart beat':
                    clients[command.device_sn] = ws; //save the mapping between device_sn and ws
                    break;
            }

            if (command.reply && command.command_id) {
                if (pendingRequests[command.command_id]) {
                    pendingRequests[command.command_id].send(JSON.stringify({success: true, data: command}));
                    delete pendingRequests[command.command_id];
                }
            }

            return;
        }


        //server command format {servercmd: "send to device", device_sn: "xxxxxxxx", data: {command_id: "xxxxxx", cmd: "xxxx"}}
        if (command.servercmd) {
            if (command.servercmd === 'send to device') {
                    if (command.data?.command_id) {
                        if (clients[command.device_sn]) {
                            clients[command.device_sn].send(JSON.stringify(command.data));
                            pendingRequests[command.data.command_id] = ws;
        
                            setTimeout(() => {
                                if (pendingRequests[command.data.command_id]) {
                                    ws.send(JSON.stringify({success: false, message: "timeout"}));
                                    delete pendingRequests[command.data.command_id];
                                }
                            }, 5000);
                    } else {
                        ws.send(JSON.stringify({success: false, message: "device not connected"}));
                    }
                } else {
                   ws.send(JSON.stringify({success: false, message: "command payload must have command_id"}));
                }
            } else {
                ws.send(JSON.stringify({success: false, message: "unknown servercmd"}));
            }
        }
    });
});