import { MessageTypeEnum } from "../enums/message-type-enum";

export interface INewMessage {
    threadId: number;
    groupId: number;
    content: string;
    timestamp: Date;
    type: MessageTypeEnum;
}