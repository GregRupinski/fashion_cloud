export interface ICacheRepository{
    getAllKeys():Promise<Array<string>>;
    find(key:string):Promise<any>;
    delete(key:string):Promise<boolean>;
    deleteAll():Promise<boolean>;
    insert(data:any):Promise<{key:string, value:string}>
}