class SearchUser {
    username;
    isOnline;

    constructor(username, isOnline){
        this.username = username;
        this.isOnline = isOnline;
    }

    get username(){
        return this._username;
    }

    set username(newUsername){
        this._username = newUsername;
    }

    get isOnline(){
        return this._isOnline;
    }

    set isOnline(newIsOnline){
        this._isOnline = newIsOnline;
    }
}

module.exports = { SearchUser };