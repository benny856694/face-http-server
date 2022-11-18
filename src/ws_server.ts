// @ts-check

//device http command
//设备定义的http命令，参见http文档
interface Command {
  cmd: string;
  command_id: string;
}

//replay to command from backend server
//给后台命令的应答
interface Reply {
  success: boolean;
  message?: string;
  data?: any;
}

//command send from backend server to device
//从后台发给设备的命令
interface Request {
  servercmd: "send to device";
  device_sn: string;
  data: Command;
}

import { WebSocketServer, WebSocket } from "ws";
const debug = require("debug")("ws_server");

const wss = new WebSocketServer({
  port: 8080,
  clientTracking: true,
});

const clients: WebSocket[] = [];
const pendingRequests: WebSocket[] = [];

wss.on("connection", function connection(ws, req) {
  debug("connection from: %s", req.socket.remoteAddress);
  ws.on("message", function message(data) {
    var command: any = null;
    try {
      command = JSON.parse(data.toString());
    } catch (error) {
      ws.send(JSON.stringify({ success: false, message: error }));
      return;
    }

    //command from device
    if (command.cmd) {
      switch (command.cmd) {
        case "heart beat":
          clients[command.device_sn] = ws; //save the mapping between device_sn and ws
          break;
      }

      if (command.reply && command.command_id) {
        if (pendingRequests[command.command_id]) {
          pendingRequests[command.command_id].send(
            JSON.stringify({ success: true, data: command })
          );
          delete pendingRequests[command.command_id];
        }
      }

      debug(
        `received cmd: ${command.cmd}, reply: ${command.reply}, device_sn: ${command.device_sn}`
      );
      return;
    }

    //server command format {servercmd: "send to device", device_sn: "xxxxxxxx", data: {command_id: "xxxxxx", cmd: "xxxx"}}
    if (command.servercmd) {
      debug(
        `received servercmd: ${command.servercmd}, device_sn: ${command.device_sn}`
      );
      if (command.servercmd === "send to device") {
        if (!command.device_sn) {
          ws.send(
            JSON.stringify({ success: false, message: "device_sn is required" })
          );
          return;
        }
        if (command.data?.command_id) {
          if (clients[command.device_sn]) {
            clients[command.device_sn].send(JSON.stringify(command.data));
            pendingRequests[command.data.command_id] = ws;

            setTimeout(() => {
              if (pendingRequests[command.data.command_id]) {
                ws.send(JSON.stringify({ success: false, message: "timeout" }));
                delete pendingRequests[command.data.command_id];
              }
            }, 5000);
          } else {
            ws.send(
              JSON.stringify({
                success: false,
                message: "device not connected",
              })
            );
          }
        } else {
          ws.send(
            JSON.stringify({
              success: false,
              message: "command payload must have command_id",
            })
          );
        }
      } else {
        ws.send(
          JSON.stringify({ success: false, message: "unknown servercmd" })
        );
      }
    }
  });
});
