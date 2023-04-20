import { IThread } from "./thread-interface";

export interface IGroup{
    groupId: number;
    groupName: string;
    threads: IThread[];
    unseenMessages: number;
}