class CustomError{
    name;
    message;

    constructor(name, message){
        this.name = name;
        this.message = message;
    }

    get name(){
        return this._name;
    }

    set name(newName){
        this._name = newName;
    }

    get message(){
        return this._message;
    }

    set message(newMessage){
        this._message = newMessage;
    }
}

module.exports = { CustomError };