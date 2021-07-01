

const Chat = {
    messages: [],
    users: [],

    Init: function (msgs = [], urs = []) {
        this.messages = msgs;
        this.users = urs;
    },

    addUser: function (id, user) {
        this.users[id] = user;
    },

    getUser: function (id) { return this.users[id]; },
    addMessage: function (msg) {
        messages.push(msg);
    },
    info: function () { return { messages: this.messages, users: this.users }; }
}
const CreateID = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
}
module.exports = {
    CreateID,
    Chat,
}