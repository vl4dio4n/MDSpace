class ContactMessage{
    messageId;
    senderId;
    senderUsername;
    content;
    timestamp;
    type;

    constructor(messageId, senderId, senderUsername, content, timestamp, type){
        this.messageId = messageId;
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