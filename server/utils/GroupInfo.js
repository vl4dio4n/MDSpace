const { GroupMember } = require("./GroupMember");

class GroupInfo {
    groupId;
    groupName;
    description;
    type;
    members;

    constructor(groupId, groupName, description, type, members){
        this.groupId = groupId;
        this.groupName = groupName;
        this.description = description;
        this.type = type;
        this.members = members;
    }

    get groupId(){
        return this._groupId;
    }

    /**
     * @param {number} newGroupId
     */
    set groupId(newGroupId){
        this._groupId = newGroupId;
    }

    get groupName(){
        return this._groupName;
    }

    /**
     * @param {string} newGroupName
     */
    set groupName(newGroupName){
        this._groupName = newGroupName;
    }

    get description(){
        return this._description;
    }

    /**
     * @param {string} newDescription
     */
    set description(newDescription){
        this._description = newDescription;
    }

    get type(){
        return this._type;
    }

    /**
     * @param {string} newType
     */
    set type(newType){
        this._type = newType;
    }

    get members(){
        return this._members;
    }

    /**
     * @param {GroupMember[]} newMembers
     */
    set members(newMembers){
        this._members = newMembers;
    }
}

module.exports = { GroupInfo };