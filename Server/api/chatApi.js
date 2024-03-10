const ServiceManager = require('../services/ServiceManager.js')

class VesselReportApi {
    constructor () {
        this.serviceManager = new ServiceManager()
    }
    async ListChat(memberID) {
        var chatService = this.serviceManager.GetChatService();
        return chatService.ListChat(memberID);
    }
    async ChatMsgs(chatID, memberID) {
        var chatService = this.serviceManager.GetChatService();
        return chatService.ChatMsgs(chatID, memberID);
    }
    async ChatNewMsgs(accountID) {
        var chatService = this.serviceManager.GetChatService();
        return chatService.ChatNewMsgs(accountID);
    }
    async AddNewMsg(chatID, accountId, username, msg) {
        var chatService = this.serviceManager.GetChatService();
        return chatService.AddNewMsg(chatID, accountId, username, msg);
    }
    async GetUsersList() {
        var chatService = this.serviceManager.GetChatService();
        return chatService.GetUsersList();
    }
    async GetChatList() {
        var chatService = this.serviceManager.GetChatService();
        return chatService.GetChatList();
    }
    async GetChatData(chatID) {
        var chatService = this.serviceManager.GetChatService();
        return chatService.GetChatData(chatID);
    }
    async CreateNewChat(chatName, chatType, users) {
        var chatService = this.serviceManager.GetChatService();
        return chatService.CreateNewChat(chatName, chatType, users);
    }
    async UpdateChat(chatID, users) {
        var chatService = this.serviceManager.GetChatService();
        return chatService.UpdateChat(chatID, users);
    }
    // For Desktop Apps
    async GetAllMessages(lastChatMsg) {
        var chatService = this.serviceManager.GetChatService();
        return chatService.GetAllMessages(lastChatMsg);
    }
    async GetAllChats() {
        var chatService = this.serviceManager.GetChatService();
        return chatService.GetAllChats();
    }
    async AddOfflineMessages(messages) {
        var chatService = this.serviceManager.GetChatService();
        return chatService.AddOfflineMessages(messages);
    }
}
module.exports = new VesselReportApi();