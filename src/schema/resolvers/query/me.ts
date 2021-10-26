import { IResolvers } from '@graphql-tools/utils';
import { IUser } from '../../../interfaces/user.interface';
import { IUserResponse } from '../../../interfaces/userResponse.interface';
import JWT from '../../../lib/jwt';

// Resolvers
const queryResolvers: IResolvers = {
    Query: {
        me: ( _: void, ___: unknown, context: { token: string } ): IUserResponse => {

            const info = new JWT().verify( context.token );
            if ( info === 'Token no válido' ) {
                return {
                    status: false,
                    message: info
                };
            }

            return {
                status: true,
                message: 'Token correcto',
                user: (info as unknown as { user: IUser } ).user
            };

        }

    }
};

export default queryResolvers;