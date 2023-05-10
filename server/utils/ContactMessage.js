class ContactMessage{
    messageId;
    threadId;
    groupId;
    senderId;
    senderUsername;
    content;
    timestamp;
    type;

    constructor(messageId, threadId, groupId, senderId, senderUsername, content, timestamp, type){
        this.messageId = messageId;
        this.threadId = threadId;
        this.groupId = groupId;
        this.senderId = senderId;
        this.senderUsername = senderUsername;
        this.content = content;
        this.timestamp = timestamp;
        this.type = type;
    }

    get messageId(){
        return this._messageId;
    }

    set messageId(newMessageId){
        this._messageId = newMessageId;
    }

    get threadId(){
        return this._threadId;
    }

    set threadId(newThreadId){
        this._threadId = newThreadId;
    }

    get groupId(){
        return this._groupId;
    }

    set groupId(newGroupId){
        this._groupId = newGroupId;
    }

    get senderId(){
        return this._senderId;
    }

    set senderId(newSenderId){
        this._senderId = newSenderId;
    }

    get senderUsername(){
        return this._senderUsername;
    }

    set senderUsername(newSenderUsername){
        this._senderUsername = newSenderUsername;
    }

    get content(){
        return this._content;
    }

    set content(newContent){
        this._content = newContent;
    }

    get timestamp(){
        return this._timestamp;
    }

    set timestamp(newTimestamp){
        this._timestamp = newTimestamp;
    }

    get type(){
        return this._type;
    }

    set type(newType){
        this._type = newType;
    }
}

module.exports = { ContactMessage };