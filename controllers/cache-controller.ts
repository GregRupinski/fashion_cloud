import crypto from "crypto"

import { ICacheRepository } from "../entities/repositiories/cache-i";

export class CacheController{
    private static CACHE_LIMIT = process.env.CACHE_LIMIT || 2;
    private static TIME_TO_LIVE = 1000;

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
        const currentTimestamp = Date.now();
        const [item] = await this.cacheRepository.find(key);

        if(item){
            console.log('Cache hit');
            const newTTL = currentTimestamp + CacheController.TIME_TO_LIVE;

            if(item.ttl > currentTimestamp){
                // update ttl on every call
                await this.updateItem(item.key, {
                    ttl: newTTL,
                });
                return {...item, ttl: newTTL};
            }

            // TTL exceeded, update item with new content + reset ttl time
            const newContent = this.createRandomText();
            await this.updateItem(item.key, {
                ttl: newTTL,
                value: newContent
            });
            return {...item, ttl:newTTL, value: newContent};
        }

        // item doesnt exist, create new item for provided key
        console.log('Cache miss');

        const allKeys = await this.getAllKeys();
        // check if cache limit is reached, if yes remove oldest item
        if(allKeys.length >= CacheController.CACHE_LIMIT) {
            const oldestItem = await this.cacheRepository.getOldestItem();
            if(oldestItem) {
                await this.deleteItem(oldestItem.key);
            }
        }

        // create new item
        const value = this.createRandomText();
        const {value: result} = await this.cacheRepository.insert({
            key,
            value,
            createdAt: currentTimestamp,
            ttl: currentTimestamp + CacheController.TIME_TO_LIVE,
        });
        return result;
    }

    private createRandomText(){
        return crypto.randomBytes(64).toString('hex');
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