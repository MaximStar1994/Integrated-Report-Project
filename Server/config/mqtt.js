const cert = require('../keppelomcert')
module.exports = {
    options: {
        protocol: 'mqtt',
        port: 1883,
        username: 'HA2_user',
        password: 'AH2user#123',
        cert: cert
    },
    brokerUrl: 'mqtt://10.58.136.76',
    //  options: {
    //     protocol: 'ssl',
    //     port: 8883,
    //     username: 'HA2_user',
    //     password: 'AH2user#123',
    //     cert: cert
    // },
    // brokerUrl: 'mqtts://komassetcare.keppelom.com',
}
