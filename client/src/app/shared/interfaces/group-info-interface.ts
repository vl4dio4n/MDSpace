import { GroupTypeEnum } from "../enums/group-type-enum";
import { IGroupMember } from "./group-member-interface";

export interface IGroupInfo{
    groupId: number;
    groupName: string;
    description?: string; 
    type: GroupTypeEnum;
    members: IGroupMember[];
}