import {expect} from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import * as brandController from '../controllers/brandController.js';
import { Brand } from '../models/brand.js';

describe('Testing of brand controller', async function() {

    before(function() {
        mongoose.connect('mongodb+srv://htc_dev_admin:PAss1234567890@cluster0.adxjt.mongodb.net/htc_test')
    });

    it('Testing create brand -- should throw error if the brand name in the request is empty', async function(){
        const req = {
            body: {
                brandNameZh: null,
                brandNameEn: null
            }
        };
        const next = function(err) {
            expect(err).to.have.property('errorMessage').that.equals('Brand name is not provided');
            expect(err).to.have.property('errorCode').that.equals(401);
        };
        await brandController.createBrand(req, {}, next);

    });

    it('Testing create brand -- should throw error if response code return is not 0', async function(){
        
        sinon.stub(Brand,'findOne')
        Brand.findOne.throws();
        
        const req = {
            body: {
                brandNameZh: 'abc',
                brandNameEn: 'abc'
            }
        };
        
        const next = function(err) {
            expect(err).to.have.property('errorMessage').that.equals('Error Occurs');
            expect(err).to.have.property('errorCode').that.equals(500);
        };
        await brandController.createBrand(req, {}, next);

        Brand.findOne.restore();
    });

    it('Testing create brand -- should return success if brand created', async function(){
        
        sinon.stub(Brand,'findOne');
        sinon.stub(Brand,'create');
        Brand.findOne.returns(null);
        Brand.create.resolves();
        
        const req = {
            body: {
                brandNameZh: 'abc',
                brandNameEn: 'abc'
            }
        };
        
        const res = {
            statusCode: 500,
            returnMessage: null,
            status: function(code) {
              this.statusCode = code;
              return this;
            },
            json: function(data) {
              this.returnMessage = data.message;
            }
        };

        await brandController.createBrand(req, res, () => {});

        expect(res.statusCode).to.be.equal(201);
        expect(res.returnMessage).to.be.equal('Brand Created');

        Brand.findOne.restore();
        Brand.create.restore();
    });

    it('Testing update brand -- should throw error if the brand name and id in the request is empty', async function(){
        const req = {
            body: {
                id: null,
                brandNameZh: null,
                brandNameEn: null
            }
        };
        const next = function(err) {
            expect(err).to.have.property('errorMessage').that.equals('Please provide updated brand information');
            expect(err).to.have.property('errorCode').that.equals(401);
        };
        await brandController.updateBrand(req,{},next);
    });

    it('Testing update brand -- should throw error if response code return is not 0', async function(){
        
        sinon.stub(Brand,'findById')
        Brand.findById.throws();
        
        const req = {
            body: {
                id: 123,
                brandNameZh: 'abc',
                brandNameEn: 'abc'
            }
        };

        const next = function(err) {
            expect(err).to.have.property('errorMessage').that.equals('Error Occurs');
            expect(err).to.have.property('errorCode').that.equals(500);
        };

        await brandController.updateBrand(req, {}, next);

        Brand.findById.restore();
    });

    it('Testing update brand -- should return success if brand updated successfully', async function(){
        
        const mockBrand = {
            brandNameZh: 'abc',
            brandNameEn: 'abc',
            status: 'A',
            save: sinon.stub().resolves()
        };

        sinon.stub(Brand,'findById');
        Brand.findById.returns(mockBrand);
        
        const req = {
            body: {
                id: 123,
                brandNameZh: 'abc',
                brandNameEn: 'abc'
            }
        };

        const res = {
            statusCode: 500,
            returnMessage: null,
            status: function(code) {
              this.statusCode = code;
              return this;
            },
            json: function(data) {
              this.returnMessage = data.message;
            }
        };
        
        await brandController.updateBrand(req, res, () => {});

        expect(res.statusCode).to.be.equal(200);
        expect(res.returnMessage).to.be.equal('Brand updated');

        Brand.findById.restore();
    });

    it('Testing get brand -- should throw error if response code return is not 0', async function(){
        
        sinon.stub(Brand,'findById')
        Brand.findById.throws();
        
        const req = {
            query: {
                id: '123'
            }
        };

        const next = function(err) {
            expect(err).to.have.property('errorMessage').that.equals('Error Occurs');
            expect(err).to.have.property('errorCode').that.equals(500);
        };

        await brandController.getBrands(req, {}, next);

        Brand.findById.restore();
    });

    it('Testing get brand -- should return success if get brand successfully', async function(){

        sinon.stub(Brand,'findById');
        Brand.findById.returns('abc');
        
        const req = {
            query: {
                id: '123'
            }
        };

        const res = {
            statusCode: 500,
            returnBrands: null,
            status: function(code) {
              this.statusCode = code;
              return this;
            },
            json: function(data) {
              this.returnBrands = data.brands;
            }
        };
        
        await brandController.getBrands(req, res, () => {});

        expect(res.statusCode).to.be.equal(200);
        expect(res.returnBrands).to.deep.equals(['abc']);

        Brand.findById.restore();
    });

    it('Testing delete brand -- should throw error if response code return is not 0', async function(){
        
        sinon.stub(Brand,'findById')
        Brand.findById.throws();
        
        const req = {
            body: {
                id: '123'
            }
        };

        const next = function(err) {
            expect(err).to.have.property('errorMessage').that.equals('Error Occurs');
            expect(err).to.have.property('errorCode').that.equals(500);
        };

        await brandController.deleteBrand(req, {}, next);

        Brand.findById.restore();
    });

    it('Testing delete brand -- should return success if brand deleted successfully', async function(){

        const mockBrand = {
            brandNameZh: 'abc',
            brandNameEn: 'abc',
            status: 'A',
            save: sinon.stub().resolves()
        };

        sinon.stub(Brand,'findById');
        Brand.findById.returns(mockBrand);
        
        const req = {
            body: {
                id: '123'
            }
        };

        const res = {
            statusCode: 500,
            returnMessage: null,
            status: function(code) {
              this.statusCode = code;
              return this;
            },
            json: function(data) {
              this.returnMessage = data.message;
            }
        };
        
        await brandController.deleteBrand(req, res, () => {});

        expect(res.statusCode).to.be.equal(200);
        expect(res.returnMessage).to.be.equals('Brand Deleted');

        Brand.findById.restore();
    });

    after(function() {
        return mongoose.disconnect();
    });
})