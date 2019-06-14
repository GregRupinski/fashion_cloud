import {MongoClient, Db, Collection} from 'mongodb';

export class DBConnector{
    private mongoClient:MongoClient;
    private db:Db;

    async init(){
        this.mongoClient = await MongoClient.connect(
            process.env.DATABASE_URL || 'mongodb://localhost:27017',
            { useNewUrlParser: true },
        );
        this.db = this.mongoClient.db('myDb');
        console.log("Database connected!");
    }

    public collection(collectionName:string):Collection<any>{
        if(this.db){
            return this.db.collection(collectionName);
        } 
        return null;
    }
}
