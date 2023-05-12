const SocketEventsEnum = {
    SignIn: 'sign-in',
    NewMessage: 'new-message',
    JoinGroup: 'join-group',
    SignOut: 'sign-out',
    UserStatus: 'user-status',
    UserTyping: 'user-typing',
    AddGroupMembers: 'add-group-members',
    UserAddedToGroup: 'user-added-to-group',
    ThreadCreated: 'thread-created',
    LeaveGroup: 'leave-group'
}

module.exports = { SocketEventsEnum }