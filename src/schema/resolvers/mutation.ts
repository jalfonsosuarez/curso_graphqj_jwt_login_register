import { Db } from 'mongodb';
import { IResolvers } from '@graphql-tools/utils';
import { IUser } from '../../interfaces/user.interface';
import { IUserResponse } from '../../interfaces/userResponse.interface';
import bcrypt from 'bcrypt';

// Resolvers
const mutationResolvers: IResolvers = {
    Mutation: {
        add: async ( _: void, args: { user: IUser }, context: { db: Db } ): Promise<IUserResponse> => {

            const userCheck = await context.db.collection( 'users' )
                                        .findOne( { email: args.user.email });
            
            if ( userCheck ) {
                return {
                    status: false,
                    message: 'Existe usuario con ese email'
                };
            }

            if ( !args.user.password ) {
                return {
                    status: false,
                    message: 'Debe indicar una contraseña'
                };
            }

            const lastElement = await context.db.collection( 'users' )
                            .find().limit( 1 ).sort( { registerDate: -1 } ).toArray();

            args.user.id = lastElement.length === 0 ? '1' :String( +lastElement[0].id + 1 );
            args.user.registerDate = new Date().toISOString();
            args.user.password = bcrypt.hashSync( args.user.password, 10 );

            return await context.db.collection( 'users' ).insertOne( args.user )
                            .then( () => {
                                return {
                                    status: true,
                                    message: 'Se ha añadido un nuevo usuario',
                                    user: args.user
                                };
                            })
                            .catch( ( error ) => {
                                return {
                                    status: false,
                                    message: `Error: ${error}`
                                };
                            });

        }
    },
};

export default mutationResolvers;