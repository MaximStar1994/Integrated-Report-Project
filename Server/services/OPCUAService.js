const async = require("async");
"use strict";
class OPCUAService {
    constructor (OPCUA) {
        this.socketsToReply = []
        this.subscriptions = []
        this.sessions = []
        this.MonitorTag = this.MonitorTag.bind(this);
        this.opcua = OPCUA
        this.OnTagValueChange = this.OnTagValueChange.bind(this)
    }
    AddSubscription(completion) {
        this.opcua.ConnectClient(
            () => {
                this.opcua.CreateSession(
                (session) => { 
                    this.sessions.push(session)
                    this.opcua.CreateSubscription((subscription) => {
                        this.subscriptions.push(subscription)
                        completion(subscription)
                    })})})
    }
    AddSocket(socket) {
        if (this.subscriptions.length === 0) {
            this.AddSubscription(() => console.log("subscription added"))
        }
        this.socketsToReply.push(socket)
        socket.on("monitorTag", this.MonitorTag)
        socket.on("disconnect", () => {
            var index = this.socketsToReply.indexOf(socket);
            if (index > -1) {
                this.socketsToReply.splice(index, 1);
            }
            console.log("Client disconnected");
        });
    }
    SubscribeToTag(tagname,completion,initalizeCompletion) {
        if (this.subscriptions.length === 0) {
            this.AddSubscription(() => this.SubscribeToTag(tagname,completion,initalizeCompletion))
            return
        }
        var subscriptionTarget = this.subscriptions[0]
        this.opcua.MonitorSlow(subscriptionTarget, tagname, completion, initalizeCompletion)
    }
    MonitorTag(tagname) {
        console.log("Monitoring : " + tagname)
        // find the relevant subscription to monitor tag on 
        var subscriptionTarget = this.subscriptions[0]
        this.opcua.MonitorSlow(subscriptionTarget, tagname, this.OnTagValueChange, () => {})
    }
    OnTagValueChange(tagname, val) {
        console.log(tagname + "," + val)
        var i;
        for (i=0;i<this.socketsToReply.length;i++) {
            this.socketsToReply[i].emit(tagname,val);
        }
    }
}
module.exports = OPCUAService;
