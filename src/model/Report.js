import Model from "./Model.js"
const axios = require('axios');

class Report extends Model {
    constructor() {
        super()
    }
    GetReports(callback) {
        super.postReq('/report/list',{},(value,error)=>{
            var data = []
            if (value !== null) {
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })
    }
    UploadReport(report,callback) {
        super.postReq('/report/add',{report : report},(value,error)=>{
            var data = null
            if (value !== null) {
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })
    }

    DownloadReports(files,callback) {
        const AuthStr = 'Bearer '.concat(localStorage.getItem("authenticationToken"));
        axios.post(this.apiEndPoint + '/report/download', {files : files}, {responseType : "arraybuffer",headers: {'Authorization': AuthStr}})
        .then((response) => {
            var blob = new Blob([response.data], { type: 'octet/stream' });
            var zipURL = window.URL.createObjectURL(blob);
            callback(zipURL)
        });
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
export default Report;