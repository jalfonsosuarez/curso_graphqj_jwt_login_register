import GraphQLServer from './server';
import schema from './schema';

const graphQLServer = new GraphQLServer( schema );

graphQLServer.listen( (port) => console.log(`Servidor ==> http://localhost:${port}/graphql`));