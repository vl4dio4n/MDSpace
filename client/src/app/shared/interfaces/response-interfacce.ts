import { IError } from "./error-interface";

export interface IResponse<T>{
    error: IError;
    content: T;
}