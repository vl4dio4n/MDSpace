class ContactThread{
    threadId;
    threadName;
    lastMessage;
    unseenMessages;

    constructor(threadId, threadName, lastMessage, unseenMessages){
        this.threadId = threadId;
        this.threadName = threadName;
        this.lastMessage = lastMessage;
        this.unseenMessages = unseenMessages;
    }

    get threadId(){
        return this._threadId;
    }

    set threadId(newThreadId){
        this._threadId = newThreadId;
    }

    get threadName(){
        return this._threadName;
    }

    set threadName(newThreadName){
        this._threadName = newThreadName;
    }

    get lastMessage(){
        return this._lastMessage;
    }

    set lastMessage(newLastMessage){
        this._lastMessage = newLastMessage;
    }

    get unseenMessages(){
        return this._unseenMessages;
    }

    set unseenMessages(newUnseenMessages){
        this._unseenMessages = newUnseenMessages;
    }
}

module.exports = { ContactThread };