import express from 'express';
import bodyParser = require('body-parser');
import { CacheController } from './controllers/cache-controller';
import {CacheRepository} from './repositories/cache-repository';
import { DBConnector } from './repositories/connector';

class App {
  constructor(){
    this.init();
  }

  async init(){
      
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });
    const database:DBConnector = new DBConnector();
    await database.init();

    const cacheController:CacheController = new CacheController(new CacheRepository(database));

    /**
    * returns all stored keys in the cache
    */
    app.get('/keys', async (req, res) => {
        res.status(200).send(await cacheController.getAllKeys());
    });

    /**
    * retrieve cached item by key
    */
    app.get('/items/:key', async(req, res) => {
      const {key} = req.params;
      const result = await cacheController.getByKey(key);
      res.status(typeof result === 'string' ? 201 : 200).send(result);
    });

    /**
    * update cached item by key
    */
    app.put('/items/:key', async(req, res) => {
      const {key} = req.params;
      const body = req.body;
      const result = await cacheController.updateItem(key, body);
      res.status(result ? 204 : 404).send();
    });

    /**
     * delete cached item by key
     */
    app.delete('/items/:key', async(req, res) => {
      const {key} = req.params;
      const result = await cacheController.deleteItem(key);
      res.status(result ? 204 : 404).send();
    });

    /**
     * delete all cached items
     */
    app.delete('/items', async(req, res) => {
      const result = await cacheController.deleteAll();
      res.status(204).send();
    });

    app.listen(3000, async () => {
      console.log('Listening on port 3000!');
    });
  }
}

export = new App();
