import * as crypto from 'crypto';

import { ICacheRepository } from "../entities/repositiories/cache-i";

export class CacheController{
    constructor(readonly cacheRepository:ICacheRepository){

    }

    getAllKeys():Promise<Array<string>>{
        return this.cacheRepository.getAllKeys();
    }

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
}