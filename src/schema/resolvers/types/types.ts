import { IResolvers } from '@graphql-tools/utils';
import { IUser } from '../../../interfaces/user.interface';

const typesResolver: IResolvers = {

    Result: {
        __resolveType( root: { user: IUser, token: string } ){      
    
            if( root.user ) {        
                return 'ResultUser';      
            }      

            if( root.token  ) {        
                return 'ResultToken';      
            }      

            return null; 

        },  
    },
};

export default typesResolver;