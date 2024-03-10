"use strict";
class SocketService {
    constructor() {
    }
    createSocket(socket, mqttClient) {
        socket.on('subscribe', function (data) {
            if (mqttClient.connected) {
                // console.log("socket on subscription " + data.topic + "Msg " + JSON.stringify(data.Msg) + " key " + data.Msg.equipment + "mqttClient " + mqttClient.connected);
                // ●	Command, Timestamp, watchID, TaskID, TaskName,  TaskDescription 
                var Msg = data.Msg
                var moment = require('moment');
                var timestamp = moment(Msg.dueDate).format('DD/MM/YYYY')
                // var publicMsg = "upsert#" + timestamp + "#" + Msg.crewAssigned + "#" + Msg.taskId + "#Equipment-" + Msg.taskId + " " + Msg.equipment + "#" + Msg.description
                var publicMsg = "upsert#" + timestamp + "#" + Msg.crewAssigned  +"#" + Msg.taskId + "#Task-" + Msg.taskId + " " + Msg.equipment + "#" + Msg.description + '#'+ Msg.prior
                if (mqttClient.connected == true) {
                    mqttClient.publish(data.topic, publicMsg, '');
                }

            }


        })
        socket.on("disconnect", () => {

            socket.disconnect();
            console.log("Client disconnected");
        });
    }
}
module.exports = SocketService;