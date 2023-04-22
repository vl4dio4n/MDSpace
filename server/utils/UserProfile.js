class UserProfile {
    username;
    email;
    description;
    isOnline;


    constructor(username, email, description, isOnline){
        this.username = username;
        this.email = email;
        this.description = description;
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

    get isOnline(){
        return this._isOnline;
    }

    set isOnline(newIsOnline){
        this._isOnline = newIsOnline;
    }
}

module.exports = { UserProfile };