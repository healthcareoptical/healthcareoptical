import {expect} from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import * as categoryController from '../controllers/categoryController.js';
import { Category } from '../models/category.js';
import categoryRoute from '../routes/categoryRoute.js';

describe('Testing of category controller', async function() {

    before(function() {
        mongoose.connect('mongodb+srv://htc_dev_admin:PAss1234567890@cluster0.adxjt.mongodb.net/htc_test')
    });

    it('Testing create category -- should throw error if the category name in the request is empty', async function(){
        const req = {
            body: {
                categoryNameEn: null,
                categoryNameZh: null
            }
        };
        const next = function(err) {
            expect(err).to.have.property('errorMessage').that.equals('Category name is not provided');
            expect(err).to.have.property('errorCode').that.equals(401);
        };
        await categoryController.createCategory(req, {}, next);

    });

    it('Testing create category -- should throw error if response code return is not 0', async function(){
        
        sinon.stub(Category,'findOne')
        Category.findOne.throws();
        
        const req = {
            body: {
                categoryNameEn: 'abc',
                categoryNameZh: 'abc'
            }
        };
        
        const next = function(err) {
            expect(err).to.have.property('errorMessage').that.equals('Error Occurs');
            expect(err).to.have.property('errorCode').that.equals(500);
        };
        await categoryController.createCategory(req, {}, next);

        Category.findOne.restore();
    });

    it('Testing create category -- should return success if category created', async function(){
        
        sinon.stub(Category,'findOne');
        sinon.stub(Category,'create');
        Category.findOne.returns(null);
        Category.create.resolves();
        
        const req = {
            body: {
                categoryNameEn: 'abc',
                categoryNameZh: 'abc'
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

        await categoryController.createCategory(req, res, () => {});

        expect(res.statusCode).to.be.equal(201);
        expect(res.returnMessage).to.be.equal('Category Created');

        Category.findOne.restore();
        Category.create.restore();
    });

    it('Testing update category -- should throw error if the category name and id in the request is empty', async function(){
        const req = {
            body: {
                id: null,
                categoryNameEn: null,
                categoryNameZh: null
            }
        };
        const next = function(err) {
            expect(err).to.have.property('errorMessage').that.equals('Please provide updated category information');
            expect(err).to.have.property('errorCode').that.equals(401);
        };
        await categoryController.updateCategory(req,{},next);
    });

    it('Testing update category -- should throw error if response code return is not 0', async function(){
        
        sinon.stub(Category,'findById')
        Category.findById.throws();
        
        const req = {
            body: {
                id: 123,
                categoryNameEn: 'abc',
                categoryNameZh: 'abc'
            }
        };

        const next = function(err) {
            expect(err).to.have.property('errorMessage').that.equals('Error Occurs');
            expect(err).to.have.property('errorCode').that.equals(500);
        };

        await categoryController.updateCategory(req, {}, next);

        Category.findById.restore();
    });

    it('Testing update category -- should return success if category updated successfully', async function(){
        
        const mockCategory = {
            id: 123,
            categoryNameEn: 'cde',
            categoryNameZh: 'cde',
            status: 'A',
            save: sinon.stub().resolves()
        };

        sinon.stub(Category,'findById');
        Category.findById.returns(mockCategory);
        
        const req = {
            body: {
                id: 123,
                categoryNameEn: 'abc',
                categoryNameZh: 'abc'
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
        
        await categoryController.updateCategory(req, res, () => {});

        expect(res.statusCode).to.be.equal(200);
        expect(res.returnMessage).to.be.equal('Category updated');

        Category.findById.restore();
    });

    it('Testing get category -- should throw error if response code return is not 0', async function(){
        
        sinon.stub(Category,'findById')
        Category.findById.throws();
        
        const req = {
            query: {
                id: '123'
            }
        };

        const next = function(err) {
            expect(err).to.have.property('errorMessage').that.equals('Error Occurs');
            expect(err).to.have.property('errorCode').that.equals(500);
        };

        await categoryController.getCategories(req, {}, next);

        Category.findById.restore();
    });

    it('Testing get category -- should return success if get category successfully', async function(){

        sinon.stub(Category,'findById');
        Category.findById.returns('abc');
        
        const req = {
            query: {
                id: '123'
            }
        };

        const res = {
            statusCode: 500,
            returnCategories: null,
            status: function(code) {
              this.statusCode = code;
              return this;
            },
            json: function(data) {
              this.returnCategories = data.categories;
            }
        };
        
        await categoryController.getCategories(req, res, () => {});

        expect(res.statusCode).to.be.equal(200);
        expect(res.returnCategories).to.deep.equals(['abc']);

        Category.findById.restore();
    });

    it('Testing delete category -- should throw error if response code return is not 0', async function(){
        
        sinon.stub(Category,'findById')
        Category.findById.throws();
        
        const req = {
            body: {
                id: '123'
            }
        };

        const next = function(err) {
            expect(err).to.have.property('errorMessage').that.equals('Error Occurs');
            expect(err).to.have.property('errorCode').that.equals(500);
        };

        await categoryController.deleteCategory(req, {}, next);

        Category.findById.restore();
    });

    it('Testing delete category -- should return success if category deleted successfully', async function(){

        const mockCategory = {
            id: '123',
            categoryNameEn: 'abc',
            categoryNameZh: 'abc',
            status: 'A',
            save: sinon.stub().resolves()
        };

        sinon.stub(Category,'findById');
        Category.findById.returns(mockCategory);
        
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
        
        await categoryController.deleteCategory(req, res, () => {});

        expect(res.statusCode).to.be.equal(200);
        expect(res.returnMessage).to.be.equals('Category Deleted');

        Category.findById.restore();
    });

    after(function() {
        return mongoose.disconnect();
    });
})