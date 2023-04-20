class ContactGroup{
    groupId;
    groupName;
    threads;
    unseenMessages;

    constructor(groupId, groupName, threads, unseenMessages){
        this.groupId = groupId;
        this.groupName = groupName;
        this.threads = threads;
        this.unseenMessages = unseenMessages;
    }

    get groupId(){
        return this._groupId;
    }

    set groupId(newGroupId){
        this._groupId = newGroupId;
    }

    get groupName(){
        return this._groupName;
    }

    set groupName(newGroupName){
        this._groupName = newGroupName;
    }

    get threads(){
        return this._threads;
    }

    set threads(newThreads){
        this._threads = newThreads;
    }

    get unseenMessages(){
        return this._unseenMessages;
    }

    set unseenMessages(newunseenMessages){
        this._unseenMessages = newunseenMessages; 
    }
}

module.exports = { ContactGroup };