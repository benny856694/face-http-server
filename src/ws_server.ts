// @ts-check
import { z } from "zod";
//device http command
//设备定义的http命令，参见http文档
class Command {
  cmd: string = "";
  command_id?: string;
  reply?: string;
}

class Heartbeat {
  cmd: "heart beat" = "heart beat";
  device_sn: string = "";
}

//replay to command from backend server
//给后台命令的应答
class Reply {
  success: boolean = false;
  message?: string;
  data?: unknown;
}

//command send from backend server to device
//从后台发给设备的命令
class Request {
  servercmd: "send to device" = "send to device";
  device_sn: string = "";
  data: Command = new Command();
}

const commandSchema = z.instanceof(Command);
const heartBeatSchema = z.instanceof(Heartbeat);
const requestSchema = z.instanceof(Request);

import { WebSocketServer, WebSocket } from "ws";
const debug = require("debug")("ws_server");

const wss = new WebSocketServer({
  port: 6009,
  clientTracking: true,
});

const clients: { [key: string]: WebSocket } = {};
const pendingRequests: { [key: string]: WebSocket } = {};

wss.on("connection", function connection(ws, req) {
  debug("connection from: %s", req.socket.remoteAddress);
  ws.on("message", function message(data) {
    let heartBeat = heartBeatSchema.safeParse(data);
    //received heartbeat, save ws client
    //收到心跳，保存ws客户端和device_sn的映射
    if (heartBeat.success) {
      clients[heartBeat.data.device_sn] = ws; //save the mapping between device_sn and ws
      return;
    }

    let command = commandSchema.safeParse(data);
    //处理命令应答
    if (command.success) {
      debug(
        `received cmd: ${command.data.cmd}, reply: ${command.data.reply}, command_id: ${command.data.command_id}`
      );
      if (command.data.reply && command.data.command_id) {
        const ws = pendingRequests[command.data.command_id];
        if (ws) {
          const reply: Reply = { success: true, data: command.data };
          ws.send(JSON.stringify(reply));
        }
      }
      return;
    }

    let parseResult = requestSchema.safeParse(data);
    //server command format {servercmd: "send to device", device_sn: "xxxxxxxx", data: {command_id: "xxxxxx", cmd: "xxxx"}}
    if (parseResult.success) {
      let req = parseResult.data;
      debug(
        `received servercmd: ${req.servercmd}, device_sn: ${req.device_sn}, data: ${req.data}`
      );
      if (!req.data.command_id) {
        let reply: Reply = {
          success: false,
          message: "command_id is required",
        };
        ws.send(JSON.stringify(reply));
        return;
      }

      if (!clients[req.device_sn]) {
        let reply: Reply = {
          success: false,
          message: "device is not connected",
        };
        ws.send(JSON.stringify(reply));
        return;
      }

      pendingRequests[req.data.command_id] = ws;
      clients[req.device_sn].send(JSON.stringify(req.data));

      setTimeout(() => {
        if (pendingRequests[req.data.command_id!]) {
          let reply: Reply = { success: false, message: "timeout" };
          ws.send(reply);
          delete pendingRequests[req.data.command_id!];
        }
      }, 5000);
    } else {
      let reply: Reply = {
        success: false,
        message: parseResult.error.toString(),
      };
      ws.send(reply);
    }
  });
});
