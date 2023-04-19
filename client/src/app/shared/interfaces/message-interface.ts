export interface IMessage {
    messageId: number;
    senderId: number;
    senderUsername: string;
    content: string;
    timestamp: Date;
}