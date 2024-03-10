module.exports = function publishMsg(client,topic,msg,options){
  if (client.connected == true){
    client.publish(topic,msg,options);
  }
}


