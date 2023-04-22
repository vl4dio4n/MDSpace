import { GroupRolesEnum } from "../enums/group-roles-enum";

export interface IGroupMember{
    username: string;
    role: GroupRolesEnum
}