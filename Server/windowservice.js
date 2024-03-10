var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'Oxalis Backend',
  description: 'Webservice server for Oxalis on 8012',
  script: require('path').join(__dirname,'server.js'),
//   execPath: 'C:\\path\\to\\specific\\node.exe',
  env: {
    name: "HOME",
    value: process.env["USERPROFILE"] // service is now able to access the user who created its' home directory
  },
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ]
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});
svc.on('uninstall',function(){
    console.log('Uninstall complete.');
});

svc.install();