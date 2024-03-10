const config = require('../config/config')
const helper = require('../helper/helperWithoutApi')
const {interfaceObj} = require("./interfaces/PostGreSQLInterface")
const moment = require('moment-timezone')
class ChatService {
    constructor () {
        this.sqlInterface = interfaceObj
    }
    async ListChat(memberID) {
        var chats = await this.sqlInterface.PerformQueryPromise(`
            SELECT chat.chat_id, chat.chat_name from ${config.kstConfig.sqlTables.CHATS} chat LEFT JOIN ${config.kstConfig.sqlTables.CHATMEMBERS} mem 
            ON (chat.chat_id = mem.chat_id) WHERE mem.member_id=$1 ORDER BY chat.chat_id
        `,[memberID])
        return chats;
    }
    async ChatMsgs(chatID, memberID) {
        var chatmsgs = await this.sqlInterface.PerformQueryPromise(`
            SELECT msg_id, chat_id, msg_from_id, msg_from_name, msg, sent_datetime from ${config.kstConfig.sqlTables.CHATMSGS} WHERE chat_id=$1 ORDER BY sent_datetime
        `,[chatID]);
        var last_msg = await this.sqlInterface.PerformQueryPromise(`
            SELECT msg_id from ${config.kstConfig.sqlTables.CHATMSGS} WHERE chat_id=$1 ORDER BY msg_id DESC LIMIT 1
        `,[chatID]);
        if(last_msg.length>0){
            let updateReadmsgs = await this.sqlInterface.PerformQueryPromise(`
            UPDATE ${config.kstConfig.sqlTables.CHATMEMBERS} SET last_msg_read=${last_msg[0]['msg_id']} WHERE chat_id=$1 AND member_id=$2
        `,[chatID, memberID]);
        }
        return chatmsgs;
    }
    async ChatNewMsgs(accountID) {
        let chats = await this.ListChat(accountID);
        let result = [];
        for(let i=0; i<chats.length; i++){
            let temp = {
                chat_id: chats[i]['chat_id']
            }
            let last_msg_read = await this.sqlInterface.PerformQueryPromise(`
                SELECT last_msg_read FROM ${config.kstConfig.sqlTables.CHATMEMBERS} WHERE member_id=$1 AND chat_id=$2
            `,[accountID, chats[i].chat_id] )
            if(last_msg_read.length>0 && last_msg_read[0]['last_msg_read']!==null){
                last_msg_read = last_msg_read[0]['last_msg_read'];
                let newMsgs = await this.sqlInterface.PerformQueryPromise(`
                    SELECT COUNT(*) from ${config.kstConfig.sqlTables.CHATMSGS} WHERE msg_id>${last_msg_read} AND chat_id=$1
                `,[chats[i]['chat_id']])
                temp.newMsgs = parseInt(newMsgs[0]['count']);
            }
            else{
                last_msg_read = null;
                let newMsgs = await this.sqlInterface.PerformQueryPromise(`
                    SELECT COUNT(*) from ${config.kstConfig.sqlTables.CHATMSGS} WHERE chat_id=$1
                `,[chats[i]['chat_id']])
                temp.newMsgs = parseInt(newMsgs[0]['count']);
            }
            result.push(temp);
        }
        return result;
    }
    async AddNewMsg(chatID, accountID, username, msg) {
        var chatmsgs = await this.sqlInterface.PerformQueryPromise(`
            INSERT INTO ${config.kstConfig.sqlTables.CHATMSGS} (chat_id, msg_from_id, msg_from_name, msg, sent_datetime)
            VALUES ($1, $2, $3, $4, $5);
        `,[chatID, accountID, username, msg, moment().format()])
        return chatmsgs;
    }
    async GetUsersList() {
        var users = await this.sqlInterface.PerformQueryPromise(`
            SELECT account_id, name, account_type FROM ${config.kstConfig.sqlTables.USERACCOUNT} ORDER BY account_id
        `,[]);
        return users;
    }
    async GetChatList() {
        var chats = await this.sqlInterface.PerformQueryPromise(`
            SELECT chat_id, chat_name, chat_type FROM ${config.kstConfig.sqlTables.CHATS} ORDER BY chat_id
        `,[]);

        return chats;
    }
    async GetChatData(chatID) {
        var users = await this.sqlInterface.PerformQueryPromise(`
            SELECT member_id FROM ${config.kstConfig.sqlTables.CHATMEMBERS} WHERE chat_id=$1
        `,[chatID])
        let temp = [];
        if(users instanceof Array && users.length>0){
            users.forEach(u=>temp.push(u.member_id));
        }
        return temp;
    }
    async CreateNewChat(chatName, chatType, users) {
        var chats = await this.sqlInterface.PerformQueryPromise(`
            SELECT * from ${config.kstConfig.sqlTables.CHATS} WHERE chat_name = $1
        `,[chatName]);
        if(chats instanceof Array && chats.length===0){
            var chatId = await this.sqlInterface.PerformQueryPromise(`
                INSERT INTO ${config.kstConfig.sqlTables.CHATS} (chat_name, chat_type)
                VALUES ($1, $2) RETURNING chat_id;
            `,[chatName, chatType])
            users.forEach(async u=>{
                var chatMembers = await this.sqlInterface.PerformQueryPromise(`
                    INSERT INTO ${config.kstConfig.sqlTables.CHATMEMBERS} (chat_id, member_id, member_name)
                    VALUES ($1, $2, $3);
                `,[chatId[0].chat_id, u.account_id, u.name])
            });
    
            return chatId;
        }
        else{
            throw new Error("Chat Already exists!");
        }
    }
    async UpdateChat(chatID, users) {
        await this.sqlInterface.PerformQueryPromise(`
            DELETE from ${config.kstConfig.sqlTables.CHATMEMBERS} WHERE chat_id = $1
        `,[chatID]);

        users.forEach(async u=>{
            var chatMembers = await this.sqlInterface.PerformQueryPromise(`
                INSERT INTO ${config.kstConfig.sqlTables.CHATMEMBERS} (chat_id, member_id, member_name)
                VALUES ($1, $2, $3);
            `,[chatID, u.account_id, u.name])
        });

        return true;
    }

    async GetAllMessages(lastChatMsg) {
        let fromDate = moment().subtract(180, 'days').format('YYYY-MM-DD')
        let cmd = `SELECT *, msg_id AS online_msg_id FROM ${config.kstConfig.sqlTables.CHATMSGS} WHERE `
        if(lastChatMsg!==undefined && lastChatMsg!==null && lastChatMsg!==''){
            cmd += 'msg_id>'+lastChatMsg+' AND '
        }
        cmd+= 'sent_datetime > \''+ fromDate+'\' ORDER BY online_msg_id'
        var messages = await this.sqlInterface.PerformQueryPromise(cmd,[]);
        if(messages instanceof Array && messages.length>0){
            for(let i=0; i<messages.length; i++){
                delete messages[i].msg_id
            }
        }
        return messages;
    }

    async GetAllChats() {
        var chats = await this.sqlInterface.PerformQueryPromise(`
            SELECT * FROM ${config.kstConfig.sqlTables.CHATS}
        `,[]);
        var chatMembers = await this.sqlInterface.PerformQueryPromise(`
            SELECT * FROM ${config.kstConfig.sqlTables.CHATMEMBERS}
        `,[]);
        return {chats: chats, chatMembers: chatMembers};
    }

    async AddOfflineMessages(messages) {
        let returnData = []
        for(let i=0; i<messages.length; i++){
            var newMsgId = await this.sqlInterface.PerformQueryPromise(`
                INSERT INTO ${config.kstConfig.sqlTables.CHATMSGS} (chat_id, msg_from_id, msg_from_name, msg, sent_datetime)
                VALUES ($1, $2, $3, $4, $5) RETURNING msg_id;
            `,[messages[i].chat_id, messages[i].msg_from_id, messages[i].msg_from_name, messages[i].msg, messages[i].sent_datetime])
            returnData.push({offlineMsgId: messages[i].msg_id, onlineMsgId: newMsgId[0].msg_id})
        }
        return returnData;
    }
}
module.exports = {
    service : new ChatService(),
}