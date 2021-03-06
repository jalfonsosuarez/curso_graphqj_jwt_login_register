import { IResolvers } from '@graphql-tools/utils';
import { Db } from 'mongodb';
import { IUser } from '../../../interfaces/user.interface';
import { IUserResponse } from '../../../interfaces/userResponse.interface';
import bcrypt from 'bcrypt';
import JWT from '../../../lib/jwt';


// Resolvers
const queryResolvers: IResolvers = {
    Query: {
        login: async ( _: void, args: { email: string, password: string }, context: { db: Db } ): Promise<IUserResponse> => {
            return await context.db.collection( 'users' )
                        .findOne(
                            {
                                email: args.email
                            }
                        )
                        .then( ( user ) => {
                            if ( !user ) {
                                return {
                                    status: false,
                                    message: 'Usuario incorrecto'
                                };
                            }
                            if ( !bcrypt.compareSync( args.password, user.password ) ) {
                                return {
                                    status: false,
                                    message: 'Usuario incorrecto.'
                                };
                            }
                            delete user?.password;
                            return {
                                status: true,
                                message: 'Usuario encontrado',
                                token: new JWT().sign( user as IUser )
                            };
                        })
                        .catch( ( error ) => {
                            return {
                                status: false,
                                message: `No puede acceder ${error}`
                            };
                        });
        },
    }
};

export default queryResolvers;