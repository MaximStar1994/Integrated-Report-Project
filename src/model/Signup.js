import Model from "./Model.js";
import config from '../config/config';
class Chat extends Model {
    GetChatsList() {
        return new Promise((res, rej)=>{
            super.get('/getchats',{}, (value,error) => {
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
            })
        });
    }
    GetAppsList() {
        return new Promise((res, rej)=>{
            super.get('/getapps',{}, (value,error) => {
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
            })
        });
    }
    GetVesselsList() {
        return new Promise((res, rej)=>{
            super.get('/getvesselslist',{}, (value,error) => {
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
            })
        });
    }
    GetUserData(userID) {
        return new Promise((res, rej)=>{
            super.get('/getuserdata',{userID: userID}, (value,error) => {
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
            })
        });
    }
    GetUserList() {
        return new Promise((res, rej)=>{
            super.get('/getuserlist',{}, (value,error) => {
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
            })
        });
    }
    Signup(signupData) {
        const AuthStr = 'Bearer '.concat(localStorage.getItem("authenticationToken"));
        return new Promise((resolve, reject) => 
            fetch(this.apiEndPoint + `/signup`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': AuthStr
                },
                body: JSON.stringify(signupData)
            }).then((response) => response.json())
                .then(async parsedJson => {
                resolve(parsedJson);
            }).catch((err) => {
                reject(err);
            })    
        )
    }
    UpdateUser(userData) {
        const AuthStr = 'Bearer '.concat(localStorage.getItem("authenticationToken"));
        return new Promise((resolve, reject) => 
            fetch(this.apiEndPoint + `/updateuser`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': AuthStr
                },
                body: JSON.stringify(userData)
            }).then((response) => response.json())
                .then(async parsedJson => {
                resolve(parsedJson);
            }).catch((err) => {
                reject(err);
            })    
        )
    }
}

export default Chat;