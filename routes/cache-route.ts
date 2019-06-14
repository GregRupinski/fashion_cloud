import { Router } from 'express';
import { CacheController } from "../controllers/cache-controller";

export class CacheRoute {
    /**
     * @param router 
     * @param {CacheController} cacheController - instance of CacheController
     */
    constructor(private readonly router:Router, private readonly cacheController:CacheController) {
        this.initEndpoints();
    }

    /**
     * Initialize endpoints
     */
    initEndpoints() {
        /**
        * returns all stored keys in the cache
        */
        this.router.get('/keys', async (req, res) => {
            res.status(200).send(await this.cacheController.getAllKeys());
        });

        /**
        * retrieve cached item by key
        */
        this.router.get('/items/:key', async(req, res) => {
        const {key} = req.params;
        const result = await this.cacheController.getByKey(key);
        res.status(typeof result === 'string' ? 201 : 200).send(result);
        });

        /**
        * update cached item by key
        */
        this.router.put('/items/:key', async(req, res) => {
        const {key} = req.params;
        const body = req.body;
        const result = await this.cacheController.updateItem(key, body);
        res.status(result ? 204 : 404).send();
        });

        /**
         * delete cached item by key
         */
        this.router.delete('/items/:key', async(req, res) => {
        const {key} = req.params;
        const result = await this.cacheController.deleteItem(key);
        res.status(result ? 204 : 404).send();
        });

        /**
         * delete all cached items
         */
        this.router.delete('/items', async(req, res) => {
        const result = await this.cacheController.deleteAll();
        res.status(204).send();
        });
    }
}

