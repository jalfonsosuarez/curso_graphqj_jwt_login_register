import { Db } from 'mongodb';
import { IResolvers } from '@graphql-tools/utils';
import { IUser } from '../../../../interfaces/user.interface';
import { IUserResponse } from '../../../../interfaces/userResponse.interface';
import JWT from '../../../../lib/jwt';

// Resolvers
const mutationResolvers: IResolvers = {
    Mutation: {
        update: async ( _: void, args: { user: IUser }, context: { db: Db, token: string } ): Promise<IUserResponse> => {

            const info = new JWT().verify( context.token );
            if ( info === 'Token no válido' ) {
                return {
                    status: false,
                    message: info
                };
            }

            const userData = await context.db.collection( 'users' )
                                        .findOne( { id: args.user.id });
            
            if ( !userData ) {
                return {
                    status: false,
                    message: 'No existe usuario.'
                };
            }            

            args.user = Object.assign( args.user, { password: userData.password, registerDate: userData.registerDate } );
            return await context.db.collection( 'users' ).updateOne( { id: args.user.id }, { $set: args.user } )
            .then( () => {
                return {
                    status: true,
                    message: 'Se ha actualizado el usuario.',
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