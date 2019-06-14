import chai from 'chai';
import {expect, use} from 'chai';
import sinon from 'sinon'
import sinonChai from 'sinon-chai';
import { ICacheRepository } from '../entities/repositiories/cache-i';
import { CacheController } from '../controllers/cache-controller';
import { CacheRepository } from '../repositories/cache-repository';
use(sinonChai);

let cacheRepository:ICacheRepository;
let cacheController:CacheController;
beforeEach(()=>{
    const db:any = sinon.stub();
    db.collection = sinon.stub();

    cacheRepository = new CacheRepository(db as any);
    const findStub = cacheRepository.find = sinon.stub();
    findStub.withArgs('abc').resolves([]);
    findStub.withArgs('def').resolves([{"_id":"5d038855ffab2d5e2ca937eb","key":"def","value":"LALALA","createdAt":1560512597916,"ttl":1560513807721}]);

    const updateStub = cacheRepository.update = sinon.stub().resolves(true);

    cacheController = new CacheController(cacheRepository);
});

describe('CacheController ', () => {
    describe('updateItem,', () => {
        it(' update item, when exist', async() => {
            const result = await cacheController.updateItem('def', {test1: 1});
            expect(cacheRepository.find).to.have.been.calledOnceWith('def');
            expect(cacheRepository.update).to.have.been.calledOnceWith('def', {test1: 1});
            chai.expect(result).to.be.equal(true);
        });
        
        it(' returns null, when item doesnt exists', async() => {
            const result = await cacheController.updateItem('abc', {test1: 1});
            chai.expect(result).to.be.equal(null);
            expect(cacheRepository.find).to.have.been.calledOnceWith('abc');
            expect(cacheRepository.update).to.have.been.callCount(0);
        });
    });

});