const opcua = require("node-opcua");

"use strict";
class OPCUAInterface {
    constructor () {
        this.endpointUrl = "opc.tcp://10.201.1.3:51310/CogentDataHub/DataAccess"
        this.client =  opcua.OPCUAClient.create({
                            endpoint_must_exist: false
                        })
        this.client.on("backoff", (retry, delay) => 
                        console.log("still trying to connect to ", endpointUrl ,": retry =", retry, "next attempt in ", delay/1000, "seconds" )
                        );
        this.session = undefined;
        this.ConnectClient = this.ConnectClient.bind(this)
        this.CreateSession = this.CreateSession.bind(this)
        this.CreateSubscription = this.CreateSubscription.bind(this)
    }
    ConnectClient(completion, endpoint) {
        var url = endpoint
        if (endpoint === undefined) {
            url = this.endpointUrl
        }
        this.client.connect(url, function (err) {
            if(err) {
                console.log(" cannot connect to endpoint :" , url );
            } else {
                console.log("connected !");
                completion()
            }
        });
    }
    CreateSession(completion) {
        var that = this
        this.client.createSession( function(err, session) {
            if(err) {
                return completion(null);
            }
            that.session = session;
            completion(session);
        });
    }
    CreateSubscription(completion) {
        const subscriptionOptions = {
            maxNotificationsPerPublish: 1000,
            publishingEnabled: true,
            requestedLifetimeCount: 100,
            requestedMaxKeepAliveCount: 10,
            requestedPublishingInterval: 500
        };
        this.session.createSubscription2(subscriptionOptions, (err, subscription) => {
            if(err) { return completion(err); }
            completion(subscription);
            subscription.on("started", () => {
                console.log("subscription started for 2 seconds - subscriptionId=", the_subscription.subscriptionId);
            }).on("terminated", function() {
                console.log("terminated");
            });
        });
    }
    ReadValue(tagId, completion){
        const maxAge = 0;
        if (tagId !== undefiend ) {
            const nodeToRead = { nodeId: tagId, attributeId: opcua.AttributeIds.Value };
            this.session.read(nodeToRead, maxAge, function(err, dataValue) {
                if (!err) {
                    console.log(" data point : " , dataValue.toString());
                }
                completion(dataValue);
            });
        }
    }
    Monitor(subscription, tagId, completion, initializeCompletion){
        const monitoredItem  = subscription.monitor({
               nodeId: opcua.resolveNodeId(tagId),
               attributeId: opcua.AttributeIds.Value
           },
           {
               samplingInterval: 100,
               discardOldest: true,
               queueSize: 10
           },
           opcua.TimestampsToReturn.Both
        );
        monitoredItem.then(function(monitoredSuccessItem) {
            initializeCompletion(tagId)
            monitoredSuccessItem.on("changed", function(dataValue) {
                completion(tagId, dataValue.value.value, new Date(dataValue.sourceTimestamp) )
            });
         })
    }
    MonitorSlow(subscription, tagId, completion, initializeCompletion){
        const monitoredItem  = subscription.monitor({
               nodeId: opcua.resolveNodeId(tagId),
               attributeId: opcua.AttributeIds.Value
           },
           {
               samplingInterval: 5000,
               discardOldest: true,
               queueSize: 10
           },
           opcua.TimestampsToReturn.Both
        );
        monitoredItem.then(function(monitoredSuccessItem) {
            initializeCompletion(tagId)
            monitoredSuccessItem.on("changed", function(dataValue) {
                completion(tagId, dataValue.value.value, new Date(dataValue.sourceTimestamp) )
            });
       })
    }
    DisconnectClient() {
        this.client.disconnect()
    }
}

module.exports = OPCUAInterface;