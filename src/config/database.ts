import { Db, MongoClient } from 'mongodb';
import chalk from 'chalk';
class Database {

    db?: Db;

    async init(): Promise<Db | undefined> {
        console.log( '===================== Database ====================='  );
        try {
            const MONGODB = process.env.DATABASE || 'mongodb://localhost:27017/jwt-login-register-21';
            const mongoClient = await MongoClient.connect( MONGODB );
            this.db = mongoClient.db();
            console.log(`Status: ${chalk.greenBright('ON LINE')}`);
            console.log(`Database: ${chalk.greenBright(this.db.databaseName)}`);
        } catch( error ) {
            console.error( `Error: ${ error }` );
            console.log(`Status: ${chalk.redBright('OFF LINE')}`);
            console.log(`Database: ${chalk.redBright(this.db?.databaseName)}`);
        }
        return this.db;
    }

}

export default Database;