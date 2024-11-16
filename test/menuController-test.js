import {expect} from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import * as menuController from '../controllers/menuController.js';
import { Category } from '../models/category.js';
import { Product } from '../models/product.js';


describe('Testing of menu controller', async function() {

    before(function() {
        mongoose.connect('mongodb+srv://htc_dev_admin:PAss1234567890@cluster0.adxjt.mongodb.net/htc_test')
    });

    it('Testing get selections -- should throw error if the error code from service is not 0', async function(){
        
        sinon.stub(Category,'find')
        Category.find.throws();

        const next = function(err) {
            expect(err).to.have.property('errorMessage').that.equals('Error Occurs');
            expect(err).to.have.property('errorCode').that.equals(500);
        };
        await menuController.getSelections({}, {}, next);

        Category.find.restore();
    });

    it('Testing get selections -- should return success if get selections return successfully', async function(){

        sinon.stub(Category,'find');
        sinon.stub(Product, 'find');
        Category.find.returns(['category']);
        Product.find.returns({
            populate: sinon.stub().returns([{ brand: 'Brand A'}])
        });
        
        const res = {
            statusCode: 500,
            returnSelections: null,
            status: function(code) {
              this.statusCode = code;
              return this;
            },
            json: function(data) {
              this.returnSelections = data.menu;
            }
        };
        
        await menuController.getSelections({}, res, () => {});

        expect(res.statusCode).to.be.equal(200);
        expect(res.returnSelections.length).to.be.greaterThan(0);

        Category.find.restore();
        Product.find.restore();
    });

    after(function() {
        return mongoose.disconnect();
    });
})