import { ApolloServer } from 'apollo-server-express';
import compression from 'compression';
import express, { Application } from 'express';
import { GraphQLSchema } from 'graphql';
import { createServer, Server } from 'http';
import environments from './config/environment';
import Database from './config/database';

class GraphQLServer {
  // Propiedades
  private app!: Application;
  private httpServer!: Server;
  private readonly DEFAULT_PORT = process.env.PORT || '3025';
  private schema!: GraphQLSchema;

  constructor( schema?: GraphQLSchema ) {
    // this.DEFAULT_PORT = process?.env?.PORT || '3025';
    if ( !schema || schema === undefined ) {
        throw new Error( 'No se ha proporcionado el schema de GraphQL' );
    }
    this.schema = schema;
    this.init();
  }

  private init() {
    this.initializeEnvironments();
    this.configExpress();
    this.configApolloServerExpress();
    this.configRoutes();
  }

  private initializeEnvironments() {
    if (process.env.NODE_ENV != 'production') {
      const envs = environments;
    }
  }

  private configExpress() {
    this.app = express();
    this.app.use(compression());
    this.httpServer = createServer( this.app );
  }

  private async configApolloServerExpress() {

    const database = new Database();
    const db = await database.init();

    const context = async() => {
      return { db };
    };

    const apolloServer = new ApolloServer({
      context,
      schema: this.schema,
      introspection: true,
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({ app: this.app, cors: true });
  }

  private configRoutes() {
    this.app.get('/hello', (_, res) => {
        res.send('¡Hola mundo!');
      });
  
      this.app.get('/', (_, res) => {
        res.redirect('/graphql');
      });  
  }

  listen(callback: (port: number) => void): void {
    this.init();
    this.httpServer.listen(this.DEFAULT_PORT, () => {
      callback( parseInt( this.DEFAULT_PORT ) );
    });
  }
}

export default GraphQLServer;
