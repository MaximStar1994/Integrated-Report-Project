import socketIOClient from "socket.io-client";
const axios = require('axios');
axios.defaults.withCredentials  = true
// require('dotenv').config()
class Model {
    constructor() {
        this.socketEndPoint = window.SOCKET_ENDPOINT
        this.apiEndPoint = window.API_ENDPOINT
        // this.socket = socketIOClient(this.socketEndPoint);
        // this.socket = null
    }

    uploadPDF(body, callback) {
        axios
            .post(this.apiEndPoint + "/file/pdf/upload", body, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
            .then(function (response) {
                if (response !== null) {
                    callback(response.data, null);
                    return;
                }
            });
    }
    getwoLocalStorage(path, params, callback) {
        axios.get(this.apiEndPoint + path, {
            params: params,
        }).then(function (res) {
            callback(res.data, null)
        }).catch(function (error) {
            console.log(error)
            callback(null, error)
        });
    }
    postwoLocalStorage(path, body, callback) {
        axios.post(
            this.apiEndPoint + path,
            body,
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(function (response) {
                if (response !== null) {
                    callback(response.data, null)
                }
            })
            .catch(function (error) {
                console.log(error);
                callback(null, error)
            });
    }
    get(path, params, callback) {
        const AuthStr = 'Bearer '.concat(localStorage.getItem("authenticationToken"));
        axios.get(this.apiEndPoint + path, {
            params: params,
            headers: {
                'Authorization': AuthStr
            }
        }).then(function (res) {
            callback(res.data, null)
        }).catch(function (error) {
            console.log(error)
            callback(null, error)
        });
    }
    postReq(path, body, callback) {
        const AuthStr = 'Bearer '.concat(localStorage.getItem("authenticationToken"));
        body["projname"] = localStorage.getItem("project") || "B357";
        axios.post(
            this.apiEndPoint + path,
            body,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AuthStr
                },
                withCredentials: false
            })
            .then(function (response) {
                if (response !== null) {
                    callback(response.data, null)
                }
            })
            .catch(function (error) {
                console.log(error);
                callback(null, error)
            });
    }
    delete(path, params, callback) {
        const AuthStr = "Bearer ".concat(
          localStorage.getItem("authenticationToken")
        );
        axios
          .delete(this.apiEndPoint + path, {
            params: params,
            headers: {
              Authorization: AuthStr,
            },
          })
          .then(function (res) {
            callback(res.data, null);
          })
          .catch(function (error) {
            console.log(error);
            callback(null, error);
          });
    }
}
export default Model;