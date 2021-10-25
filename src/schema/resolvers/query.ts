import { IResolvers } from '@graphql-tools/utils';
import { Db } from 'mongodb';
import { IUser } from '../../interfaces/user.interface';
import { IUserResponse } from '../../interfaces/userResponse.interface';
import bcrypt from 'bcrypt';
import JWT from '../../lib/jwt';

// Resolvers
const queryResolvers: IResolvers = {
    Query: {
        users: async ( _: void, __: unknown,  context: { db: Db } ): Promise<Array<IUser>> => {
            return await context.db.collection( 'users' ).find().toArray() as Array<IUser>;
        },

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
                            delete user?.id;
                            delete user?.password;
                            delete user?.registerDate;
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