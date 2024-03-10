import Model from "./Model.js"
const axios = require('axios');
class Document extends Model {
    constructor() {
        super()

    }
    ListAllFolders(vesselId,callback) {
        //super.get("/document/folder/list/${vesselId}", null, (value, error) => {
        super.get(`/document/folder/list/${vesselId}`, null, (value, error) => {
            var data = null
            if (value !== null) {
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })
    }
    
    GetFilesInFolderByIdAndName(folderId,foldername, callback) {
        super.get(`/document/folder/${folderId}/${foldername}`, null, (value, error) => {
            var data = null
            if (value !== null) {
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })
    }

    DeleteFiles(selectedFiles, callback) {
        return new Promise((res, rej)=>{
            super.postReq('/document/file/deleteFiles',{files : selectedFiles}, (value,error) => {
                if(!error){
                    if(value.success === true){
                        res(value.value);
                    }
                    else {
                        rej("Unable to retrieve information!");
                    }
                }
                else {
                    rej("No internet!");
                }
                callback(value, error)
            })
        });
    }
    
    PostFolder(folder, callback) {
        const AuthStr = 'Bearer '.concat(localStorage.getItem("authenticationToken"));
        fetch(this.apiEndPoint + `/document/folder`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': AuthStr
            },
            body: JSON.stringify(folder)
        }).then((response) => {
            return response.json();
        }).then((responseJSON) => {
            callback(responseJSON);
        })
    }

    PostFile(body, folderId, updateUploadPercent, callback) {
        const AuthStr = 'Bearer '.concat(localStorage.getItem("authenticationToken"));
        console.log('Inside Model')
        axios
            .post(this.apiEndPoint + "/document/file/" + folderId + "/file/upload", body, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    'Authorization': AuthStr
                },
                onUploadProgress: progressEvent => {
                    const {loaded, total} = progressEvent;
                    let percent = Math.floor((loaded*100)/total);
                    console.log(percent, 'percent');
                    updateUploadPercent(percent);
                }
            })
            .then(function (response) {
                if (response !== null) {
                    callback(response.data, null);
                    return;
                }
            });
    }

    DeleteFolder(selectedFolder,callback) {
        console.log('Model--',selectedFolder)
        return new Promise((res, rej)=>{
            super.postReq('/document/folder/deleteFolder',{folder : selectedFolder}, (value,error) => {
                if(!error){
                    if(value.success === true){
                        res(value.value);
                    }
                    else {
                        rej("Unable to retrieve information!");
                    }
                }
                else {
                    rej("No internet!");
                }
                callback(value, error)
            })
        });
    }
   
}
export default Document