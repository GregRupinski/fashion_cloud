import { ICacheRepository } from '../entities/repositiories/cache-i';
import {DBConnector} from './connector';

/**
 * Access cached information
 */
export class CacheRepository implements ICacheRepository{
    constructor(private readonly db:DBConnector){
    }
}