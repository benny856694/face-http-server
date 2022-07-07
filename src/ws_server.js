const wsSocketServer = require('ws').WebSocketServer;
const debug = require('debug')('ws_server');

const wss = new wsSocketServer({
    port: 8080,
    clientTracking: true
});

const clients = [];

const replies = [];

wss.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
        debug('received: %s', data);

        var command = JSON.parse(data);

        //command from device
        if (command.cmd) {
            switch (command.cmd) {
                case 'heart beat':
                    clients[command.device_sn] = ws; //save the mapping between device_sn and ws
                    break;
            }

            if (command.reply && command.command_id) {
                replies[command.command_id] = command;
            }

        }


        //server command format {servercmd: "send to device", device_sn: "xxxxxxxx", data: {command_id: "xxxxxx", cmd: "xxxx"}}
        if (command.servercmd) {
            if (command.servercmd == 'send to device') {
                if (clients[command.device_sn]) {
                    clients[command.device_sn].send(JSON.stringify(command.data));

                    if (command.data && command.data.command_id) {
                        setTimeout(() => {
                            if (replies[command.data.command_id]) {
                                ws.send(JSON.stringify(replies[command.data.command_id]));
                                delete replies[command.data.command_id];
                            } else {
                                ws.send(JSON.stringify({
                                    servercmd: 'send to device',
                                    device_sn: command.device_sn,
                                    data: {
                                        command_id: command.data.command_id,
                                        status: 'timeout'
                                    }
                                }));
                            }
                        }, 2000);
                    }
                } else {
                    ws.send(JSON.stringify({
                        servercmd: 'send to device',
                        device_sn: command.device_sn,
                        data: {
                            command_id: command.data.command_id,
                            status: 'device not found'
                        }
                    }));
                }

                

            }
        }


    });


});