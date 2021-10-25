import jwt from 'jsonwebtoken';
import { IUser } from '../interfaces/user.interface';


class JWT {

    private secretKey = process.env.SECRET_KEY || '@565Jxz.@bbc';

    sign( data: IUser, expiresIn = process.env?.EXPIRATION_TIME || 10800 ): string {

        return jwt.sign( { user:data }, this.secretKey, { expiresIn } );

    }

}

export default JWT;