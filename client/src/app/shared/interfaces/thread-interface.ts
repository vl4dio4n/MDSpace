import { IMessage } from "./message-interface";

export interface IThread{
    threadId: number;
    threadName: string;
    lastMessage: IMessage | undefined;
    unseenMessages: number;
}