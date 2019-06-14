export interface ICacheRepository{
    getAllKeys():Promise<Array<string>>;
    find(key:string):Promise<any>;
    insert(data:any):Promise<{key:string, value:string}>
}