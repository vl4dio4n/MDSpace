import { IThread } from "./thread-interface";

export interface IGroup{
    group_id: number;
    group_name: string;
    threads: IThread[];
}