import { IUser } from './user.interface';


export interface IUserResponse {
    status: boolean;
    message: string;
    user?: IUser;
    token?: string;
}