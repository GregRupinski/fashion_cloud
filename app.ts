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

    // returns all stored keys in the cache
    app.get('/keys', async (req, res) => {
        res.send(await cacheController.getAllKeys());
    });

    app.get('/items/:key', async(req, res) => {
      const {key} = req.params;
      const result = await cacheController.getByKey(key);
      res.send(result);
    });




    app.listen(3000, async () => {
      
      console.log('Listening on port 3000!');
    });
  }
}

export = new App();
