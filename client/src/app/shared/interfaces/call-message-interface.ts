import { MessageTypeEnum } from "../enums/message-type-enum";

export interface ICallMessage {
    roomId: string;
    senderUsername: string;
    content: string;
    timestamp: Date;
    type: MessageTypeEnum;
}