const express = require("express");
const router = express.Router();
const helper = require('../helper/helper');
const chatApi = require('../api/chatApi');
const config = require('../config/config');
const { info, err: ErrorLog } = require("../common/log");

module.exports = function(api) {
    router.get("/chat/list", async (req, res) => {
        var memberID = req.query.memberID;
        try{
            const list = await chatApi.ListChat(memberID);
            helper.callback(res, list, null);
        }
        catch (err) {
            ErrorLog(`Chat list api error block : ${err.message}`);
            helper.callback(res, null, err);
        }
    })
    router.get("/chat/getusers", async (req, res) => {
        try{
            const list = await chatApi.GetUsersList();
            helper.callback(res, list, null);
        }
        catch (err) {
            ErrorLog(`Chat get users api error block : ${err.message}`);
            helper.callback(res, null, err);
        }
    })
    router.get("/chat/getchatlist", async (req, res) => {
        try{
            const list = await chatApi.GetChatList();
            helper.callback(res, list, null);
        }
        catch (err) {
            ErrorLog(`Get chat list api error block : ${err.message}`);
            helper.callback(res, null, err);
        }
    })
    router.get("/chat/getchatdata", async (req, res) => {
        var chatID = req.query.chatID;
        try{
            const list = await chatApi.GetChatData(chatID);
            helper.callback(res, list, null);
        }
        catch (err) {
            ErrorLog(`Get chat data api error block : ${err.message}`);
            helper.callback(res, null, err);
        }
    })
    router.get("/chat/msgs", async (req, res) => {
        var chatID = req.query.chatID;
        var memberID = req.query.memberID;
        try{
            const list = await chatApi.ChatMsgs(chatID, memberID);
            helper.callback(res, list, null);
        }
        catch (err) {
            ErrorLog(`Chat message api error block : ${err.message}`);
            helper.callback(res, null, err);
        }
    })
    router.get("/chat/newmsgs", async (req, res) => {
        var accountID = req.query.accountID;
        try{
            const result = await chatApi.ChatNewMsgs(accountID);
            helper.callback(res, result, null);
        }
        catch (err) {
            ErrorLog(`Chat message api error block : ${err.message}`);
            helper.callback(res, null, err);
        }
    })
    router.post("/chat/msgs", async (req, res) => {
        var chatID = req.body.chatID;
        var msg = req.body.msg;
        try{
            helper.authorize(res,req, async(user)=>{
                const result = await chatApi.AddNewMsg(chatID, user.accountId, user.name, msg);
                helper.callback(res, result, null);
            })
        }
        catch (err) {
            ErrorLog(`Chat message api error block : ${err.message}`);
            helper.callback(res, null, err);
        }
    })
    router.post("/chat/createchat", async (req, res) => {
        var chatName = req.body.chatName;
        var chatType = req.body.chatType;
        var users = req.body.users;
        try{
            helper.authorize(res,req, async(user)=>{
                try{
                    const result = await chatApi.CreateNewChat(chatName, chatType, users);
                    helper.callback(res, result, null);
                }
                catch (err) {
                    ErrorLog(`Create chat api error block : ${err.message}`);
                    helper.callback(res, null, err);
                }
            })
        }
        catch (err) {
            ErrorLog(`Create chat api error block : ${err.message}`);
            helper.callback(res, null, err);
        }
    })
    router.post("/chat/updatechat", async (req, res) => {
        var chatID = req.body.chatID;
        var users = req.body.users;
        try{
            helper.authorize(res,req, async(user)=>{
                try{
                    const result = await chatApi.UpdateChat(chatID, users);
                    helper.callback(res, result, null);
                }
                catch (err) {
                    ErrorLog(`Update chat api error block : ${err.message}`);
                    helper.callback(res, null, err);
                }
            })
        }
        catch (err) {
            ErrorLog(`Update chat api error block : ${err.message}`);
            helper.callback(res, null, err);
        }
    })
    router.get("/chat/getallchats", async (req, res) => {
        try{
            helper.authorize(res,req, async(user)=>{
                try{
                    const result = await chatApi.GetAllChats();
                    helper.callback(res, result, null);
                }
                catch (err) {
                    ErrorLog(`Get All Chats api error block : ${err.message}`);
                    helper.callback(res, null, err);
                }
            })
        }
        catch (err) {
            ErrorLog(`Get All Chats api error block : ${err.message}`);
            helper.callback(res, null, err);
        }
    })
    router.get("/chat/getallmessages", async (req, res) => {
        var lastChatMsg = req.query.lastChatMsg;
        try{
            helper.authorize(res,req, async(user)=>{
                try{
                    const result = await chatApi.GetAllMessages(lastChatMsg);
                    helper.callback(res, result, null);
                }
                catch (err) {
                    ErrorLog(`Get All Chat Messages api error block : ${err.message}`);
                    helper.callback(res, null, err);
                }
            })
        }
        catch (err) {
            ErrorLog(`Get All Chat Messages api error block : ${err.message}`);
            helper.callback(res, null, err);
        }
    })
    

    router.post("/chat/updatofflinemsgs", async (req, res) => {
        var messages = req.body.messages;
        try{
            helper.authorize(res,req, async(user)=>{
                try{
                    const result = await chatApi.AddOfflineMessages(messages);
                    helper.callback(res, result, null);
                }
                catch (err) {
                    ErrorLog(`Update chat api error block : ${err.message}`);
                    helper.callback(res, null, err);
                }
            })
        }
        catch (err) {
            ErrorLog(`Update chat api error block : ${err.message}`);
            helper.callback(res, null, err);
        }
    })
    return router
}