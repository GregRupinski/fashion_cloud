import {Collection, InsertOneWriteOpResult} from 'mongodb';

import { ICacheRepository } from '../entities/repositiories/cache-i';
import {DBConnector} from './connector';

/**
 * Access cached information
 */
export class CacheRepository implements ICacheRepository{

    private collection:Collection<any>;

    constructor(private readonly db:DBConnector){
       this.collection =  db.collection('cache');
    }

    public async getAllKeys():Promise<Array<string>>{
        const items = await this.collection.find().toArray();
        return items.map(item => item.key);
    }

    public find(key:string):Promise<{}>{
        return this.collection.find({key}).limit(1).toArray();
    }

    /**
     * Insert item @data into db
     * Returns inserted data
     * @param data 
     */
    public async insert(data:any):Promise<{key:string, value:string}>{
        const {ops:[result]} = await this.collection.insertOne(data);
        return result;
    }

    /**
     * Delete item.
     * Returns true if item was successfully deleted
     * @param key 
     */
    public async delete(key:string):Promise<boolean>{
        const {deletedCount} = await this.collection.deleteOne({key});
        return deletedCount > 0;
    }

    public async deleteAll(){
        const result = await this.collection.deleteMany({});
        return true;
    }

    public async update(key:string, data:any):Promise<boolean>{
        const {modifiedCount} = await this.collection.updateOne({key}, {'$set': data});
        return modifiedCount > 0;
    }
}