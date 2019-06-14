import { ICacheRepository } from "../entities/repositiories/cache-i";

export class CacheController{
    constructor(readonly cacheRepository:ICacheRepository){

    }
}