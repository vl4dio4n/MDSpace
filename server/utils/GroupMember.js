class GroupMember {
    username;
    role;

    constructor(username, role){
        this.username = username;
        this.role = role;
    }

    get username(){
        return this._username;
    }

    /**
     * @param {string} newUsername
     */
    set username(newUsername){
        this._username = newUsername;
    }

    get role(){
        return this._role;
    }

    /**
     * @param {string} newRole
     */
    set role(newRole){
        this._role = newRole;
    }
}

module.exports = { GroupMember };