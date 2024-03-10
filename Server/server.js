require('dotenv').config()
const express = require("express");
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require("http");
const config = require('./config/config')
// const port = process.env.PORT;
const port = 8015

const index = require("./routes/index");
const vesselReport = require("./routes/vesselReport");
const dailylog = require("./routes/dailyLog");
const crewPlanning = require("./routes/crewPlanning");
const vesselDisinfection = require("./routes/vesselDisinfection");
const crewTemperatureReport = require("./routes/crewTemperatureReport");
const vesselBreakdown = require("./routes/vesselBreakdown");
const crewWorkAndRest = require('./routes/crewWorkAndRestHour');
const vesselDashboard = require('./routes/vesselDashboard');
const fleetDashboard = require('./routes/fleetDashboard');
const analytics = require('./routes/analytics');
const documentManagement = require('./routes/documentManagement');
const exportCSV = require('./routes/exportcsvData');
const chat = require('./routes/chat');
const healthCheck = require('./routes/healthCheck');
const { info, err } = require("./common/log");

var subDir = 'kstwebservice'
const app = express();
app.set('trust proxy', 1) // trust first proxy
app.use(function (req, res, next) {
    const allowedOrigins = ['http://localhost:3000', 'https://vesselcare.keppelom.com'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.append('Access-Control-Allow-Credentials', true);
    res.append('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.append("Access-Control-Allow-Headers", "Origin, X-Requested-With, X-PINGOTHER, Content-Type, Accept, Authorization");
    if(req.method==='OPTIONS'){
      res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE')
      return res.status(200).json({});
    }
    next();
});
app.use(cookieParser(config.secretCookie));
app.use(`/${subDir}/public`,express.static(config.kstConfig.filesLocation));
app.use(express.json({limit : '50mb'}))

app.use(`/${subDir}`,index());
app.use(`/${subDir}`,vesselReport());
app.use(`/${subDir}`,dailylog());
app.use(`/${subDir}`,crewPlanning());
app.use(`/${subDir}`,vesselDisinfection());
app.use(`/${subDir}`,crewTemperatureReport());
app.use(`/${subDir}`,vesselBreakdown());
app.use(`/${subDir}`,crewWorkAndRest());
app.use(`/${subDir}`,vesselDashboard());
app.use(`/${subDir}`,fleetDashboard());
app.use(`/${subDir}`,analytics());
app.use(`/${subDir}`,documentManagement());
app.use(`/${subDir}`,exportCSV());
app.use(`/${subDir}`,chat());
app.use(`/${subDir}`,healthCheck());


const server = http.createServer(app);
// const io = socketIo(server, {
//   path: `/${subDir}/socket.io`,
//   handlePreflightRequest: (req, res) => {
//     const headers = {
//         "Access-Control-Allow-Headers": "Content-Type, Authorization",
//         "Access-Control-Allow-Origin": req.headers.origin,
//         "Access-Control-Allow-Credentials": true
//     };
//     res.writeHead(200, headers);
//   }
// });
// io.of(`${subDir}`).on("connection", socket => {
//   console.log(" io New client connected");
//   myApi.CreateSocket(socket,mqttClient)
// });
server.listen(port, () => {
  info(`Listening on port ${port}`)
});  
