import crypto from "crypto"

import { ICacheRepository } from "../entities/repositiories/cache-i";

export class CacheController{
    constructor(readonly cacheRepository:ICacheRepository){

    }

    getAllKeys():Promise<Array<string>>{
        return this.cacheRepository.getAllKeys();
    }

    /**
     * Retrieve cached item by key.
     * If doesnt exist create new item(random string) for provided key and return created string
     * @param key 
     */
    async getByKey(key:string):Promise<string | {}>{
        const item = await this.cacheRepository.find(key);
        if(item.length){
            console.log('Cache hit');
            return item[0];
        }
        console.log('Cache miss');

        const value = crypto.randomBytes(64).toString('hex');
        const {value: result} = await this.cacheRepository.insert({key, value});
        return result;
    }

    /**
     * Update cached item, if doesnt exists return null
     * @param key 
     * @param body 
     */
    async updateItem(key: string, body:any){
        const item = await this.cacheRepository.find(key);
        if(!item.length){
            return null;
        }
        const result = await this.cacheRepository.update(key, body);
        return result; 
    }

    deleteItem(key:string):Promise<boolean>{
        return this.cacheRepository.delete(key);
    }

    deleteAll():Promise<boolean>{
        return this.cacheRepository.deleteAll();
    }
}