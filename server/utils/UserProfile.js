class UserProfile {
    username;
    email;
    description;
    lastActivity;
    isOnline;

    constructor(username, email, description, lastActivity, isOnline){
        this.username = username;
        this.email = email;
        this.description = description;
        this.lastActivity = lastActivity;
        this.isOnline = isOnline;
    }

    get username(){
        return this._username;
    }

    set username(newUsername){
        this._username = newUsername;
    }

    get email(){
        return this._email;
    }

    set email(newEmail){
        this._email = newEmail;
    }

    get description(){
        return this._description;
    }

    set description(newDescription){
        this._description = newDescription;
    }

    get lastActivity(){
        return this._lastActivity;
    }

    set email(newLastActivity){
        this._lastActivity = newLastActivity;
    }

    get isOnline(){
        return this._isOnline;
    }

    set isOnline(newIsOnline){
        this._isOnline = newIsOnline;
    }
}

module.exports = { UserProfile };