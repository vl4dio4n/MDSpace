export interface IMessage {
    messageId: number;
    groupId: number;
    threadId: number;
    senderId: number;
    senderUsername: string;
    content: string;
    timestamp: Date;
    type: "text";
}