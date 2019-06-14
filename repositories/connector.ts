import {MongoClient} from 'mongodb';

export class DBConnector{
    private mongoClient:MongoClient;
    constructor(){
        this.mongoClient = new MongoClient(process.env.DATABASE_URL || 'mongodb://localhost:27017/mydb', { useNewUrlParser: true });
        this.mongoClient.connect((err, db) => {
            if (err) throw err;
            console.log("Database connected!");
        });
    }
}
