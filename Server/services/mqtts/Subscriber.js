module.exports = {
  callback: (res, value, err) => {
    if (err === null) {
      res.send({ success: true, value: value }).status(200);
    } else {
      console.log(err)
      res.send({ success: false, error: err }).status(500);
    }
  },
  SubscribeTopic: function (connection, topic) {
    connection.subscribe(topic)
  },
  SosAlert: function (topic, Msg, socket) {
    var context = Msg.toString();
    if (context != undefined) {
      var alerMsg = context.split("#");
      var msg = alerMsg[4];
      var timestamp = alerMsg[0];
      var location = alerMsg[3]

      if (socket.connected) {
        socket.emit('alert', {
          'timestamp': String(timestamp), 'location': String(location),
          'payload': String(msg)
        })
      }
    }

  },
  PostTask: function (topic, Msg, wearableApi) {
    var context = Msg.toString();
    if (context != undefined) {
      // update status 23/07/2020 19:51#357468091701316#1#Start
      var taskMsg = context.split("#");
      var taskid = taskMsg[2];
      var taskStatus = taskMsg[3];
      var progress = 0;
      if (taskMsg.length >= 5) {
        progress = parseFloat(taskMsg[4])
      }

      if (progress > 1) {
        progress = progress / 100
      }

      var taskObj = {
        "taskId": taskid,
        "status": taskStatus,
        "progress": progress
      }
      wearableApi.PostTask(taskObj, (rtn, err) => {
      })
    }
  },
  PostCrew: function (topic, Msg, wearableApi) {
    var context = Msg.toString();
    if (context != undefined) {
      //23/07/2020 19:51#1#37273732#roomA#90#80#false
      var taskMsg = context.split("#");
      var heartrate = taskMsg[5];
      var battery = taskMsg[4];
      var watchId = taskMsg[2];
      // get crew by watchId 
      if (watchId) {
        var updateCrew = {
          heartRate: heartrate,
          batteryLife: battery
        }
        wearableApi.PostCrewByWatchId(watchId, updateCrew, (rtn, err) => {
          if (err) {
            console.log("post crew" + err)
          }
        })
      }
    }

  },
  UpdateLocation: function (watchId, Msg, wearableApi) {
    var context = Msg.toString();
    if (context != undefined) {
      // var taskMsg = context.split("#");
      var locationId = context;
	  console.log("locationId " + locationId);
      // get crew by watchId 
      if (watchId) {
		  console.log("watchId " + watchId);
        wearableApi.GetCrewBySmartWatch(watchId, (rtn, err) => {
          if (rtn === null) {
            return
          }
	
          var crewId = rtn;
          if (crewId) {
            if (locationId) {
				
              var crewObj = {
                "id": crewId.id,
                "watchId": watchId,
                "locationId": locationId
              }
              wearableApi.PostLocation(crewObj, (rtn, err) => {

              })
            }

          }
        })
      }
    }

  }

}
