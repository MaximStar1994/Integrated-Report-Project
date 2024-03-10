import Model from "./Model.js"
const axios = require('axios');
function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

class Alarm extends Model {
    constructor() {
        super()
    }
    
    GetTopAlarmFreq(callback) {
        super.postReq('/rig/alarm/topfreq',{}, (value,error) => {
            var data = null
            if (value !== null) {
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })
    }

    GetAlarmMonitoring(callback) {
        super.postReq('/rig/alarm/monitoring',{}, (value,error) => {
            var data = null
            if (value !== null) {
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })
    }
    GetAlarmCategoriesCount(callback) {
        super.postReq('/asset/alarm/category-count',{},(value,error)=>{
            var data = null
            if (value !== null) {
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })
    }
    GetAlarmsCSV(callback) {
        var body = {}
        body["projname"] = localStorage.getItem("project") || "B357"
        // body.responseType = "arraybuffer"
        
        axios.post(this.apiEndPoint + '/asset/alarm/csv', body, {responseType : "arraybuffer"})
        .then((response) => {
            var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            var csvURL = window.URL.createObjectURL(blob);
            callback(csvURL)
        });
    }
}
export default Alarm;