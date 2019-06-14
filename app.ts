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

    const cacheController:CacheController = new CacheController(new CacheRepository(new DBConnector()));

    app.get('/', async (req, res) => {
        res.send('ok');
    });

    app.listen(3000, async () => {
      
      console.log('Listening on port 3000!');
    });
  }
}

export = new App();
