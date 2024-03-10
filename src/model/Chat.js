import Model from "./Model.js";
import config from '../config/config';
class Chat extends Model {
    GetChatsList(memberID) {
        return new Promise((res, rej)=>{
            super.get('/chat/list',{memberID: memberID}, (value,error) => {
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
    GetChats(chatID, memberID) {
        return new Promise((res, rej)=>{
            super.get('/chat/msgs',{chatID: chatID, memberID: memberID}, (value,error) => {
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
    GetNewMsg(accountID) {
        return new Promise((res, rej)=>{
            super.get('/chat/newmsgs',{accountID: accountID}, (value,error) => {
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
    async SendMsg(chatID, msg) {
        const AuthStr = 'Bearer '.concat(localStorage.getItem("authenticationToken"));
        return new Promise((resolve, reject) => 
            fetch(this.apiEndPoint + `/chat/msgs`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': AuthStr
                },
                body: JSON.stringify({ chatID : chatID, msg: msg })
            }).then((response) => response.json())
                .then(async parsedJson => {
                resolve(parsedJson);
            }).catch((err) => {
                reject(err);
            })    
        )
    }
    async GetUsersList(){
        return new Promise((res, rej)=>{
            super.get('/chat/getusers',null, (value,error) => {
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
    async GetChatList(){
        return new Promise((res, rej)=>{
            super.get('/chat/getchatlist',null, (value,error) => {
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
    async GetChatData(chatID){
        return new Promise((res, rej)=>{
            super.get('/chat/getchatdata',{chatID: chatID}, (value,error) => {
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
    async CreateNewChat(data) {
        const AuthStr = 'Bearer '.concat(localStorage.getItem("authenticationToken"));
        return new Promise((resolve, reject) => 
            fetch(this.apiEndPoint + `/chat/createchat`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': AuthStr
                },
                body: JSON.stringify(data)
            }).then((response) => response.json())
                .then(async parsedJson => {
                resolve(parsedJson);
            }).catch((err) => {
                reject(err);
            })    
        )
    }
    async UpdateChat(data) {
        const AuthStr = 'Bearer '.concat(localStorage.getItem("authenticationToken"));
        return new Promise((resolve, reject) => 
            fetch(this.apiEndPoint + `/chat/updatechat`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': AuthStr
                },
                body: JSON.stringify(data)
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