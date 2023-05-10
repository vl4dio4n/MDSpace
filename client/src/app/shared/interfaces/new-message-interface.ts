export interface INewMessage {
    threadId: number;
    groupId: number;
    content: string;
    timestamp: Date;
    type: 'text';
}