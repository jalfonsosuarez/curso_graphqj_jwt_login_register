import jwt from 'jsonwebtoken';
import { IUser } from '../interfaces/user.interface';


class JWT {

    private secretKey = process.env.SECRET_KEY || '@565Jxz.@bbc';

    sign( data: IUser, expiresIn = 10800 ): string {

        return jwt.sign( { user:data }, this.secretKey, { expiresIn } );

    }

    verify( token: string ): string {

        try{
            return jwt.verify( token, this.secretKey ) as string;
        } catch ( e ) {
            return 'Token no válido';
        }
    }

}

export default JWT;