const fs = require('fs');
const mqtt = require('mqtt');
const mqttConfig = require('../config/mqtt')
const subscriber = require('./mqtts/Subscriber')

class MqttClientService {
    constructor() {
        this.options = mqttConfig.options,
        this.brokerUrl = mqttConfig.brokerUrl,
        this.mqtt = mqtt
    }
    connectMqtts(socket, wearableApi) {
        const mqttClient = this.mqtt.connect(this.brokerUrl, this.options);
        mqttClient.on('connect', () => {
            subscriber.SubscribeTopic(mqttClient, "Keppel/Server/Alert")
            subscriber.SubscribeTopic(mqttClient, "Keppel/Server/Task")
            subscriber.SubscribeTopic(mqttClient, "Keppel/Server/Person")
            subscriber.SubscribeTopic(mqttClient, "Keppel/Server/Location/#")
        });

        mqttClient.on('message', function (topic, message) {

            var topicWildcard = topic;
            // receive mqtt wildcard - location
            if (topic.indexOf('Location') > -1) {
                var tempTopic = topic.split('/');
                tempTopic.pop();
                topic = tempTopic.join('/');
            }

            console.log("topic topic " + topic);
            switch (topic) {
                case 'Keppel/Server/Alert':
                    subscriber.SosAlert(topic, message, socket)
                    break;
                case 'Keppel/Server/Person':
                    subscriber.PostCrew(topic, message, wearableApi)
                    break;
                case 'Keppel/Server/Task':
                    subscriber.PostTask(topic, message, wearableApi)
                    break;
                case 'Keppel/Server/Location':
                    var topicArr = topicWildcard.split( '/' );
                    var watchId = topicArr.pop();
                    if(watchId){
                        subscriber.UpdateLocation(watchId, message, wearableApi) 
                    }
                    break;
                default:
                    break;
            }
            return
        });
        mqttClient.on('error', (err) => {
            console.log("connect to mqtt error " + err);
            mqttClient.end();
        });
        mqttClient.on('close', () => {
            console.log(`mqtt client disconnected`);
            mqttClient.end();
        });
        return mqttClient
    }
}
module.exports = MqttClientService;