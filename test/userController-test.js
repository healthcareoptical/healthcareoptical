import {expect} from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import * as userController from '../controllers/userController.js';
import { User } from '../models/user.js';
import { Role } from '../models/role.js';

describe('Testing of user controller', async function() {

    before(function() {
        mongoose.connect('mongodb+srv://htc_dev_admin:PAss1234567890@cluster0.adxjt.mongodb.net/htc_test')
    });

    it('Testing create user -- should throw error if the userId in the request is empty', async function(){
        const req = {
            body: {
                userId: null,
                password: '123456',
                reEntryPassword: '123456',
            }
        };
        const next = function(err) {
            expect(err).to.have.property('errorMessage').that.equals('Please enter userId');
            expect(err).to.have.property('errorCode').that.equals(401);
        };
        await userController.createUser(req, {}, next);
    });

    it('Testing create user -- should throw error if password does not equal reEntryPassword', async function(){
        
        const req = {
            body: {
                userId: null,
                password: '123456',
                reEntryPassword: '12345',
            }
        };
        const next = function(err) {
            expect(err).to.have.property('errorMessage').that.equals('Password does not match');
            expect(err).to.have.property('errorCode').that.equals(401);
        };
        await userController.createUser(req, {}, next);
    });

    it('Testing create user -- should throw error if return code is not 0', async function(){
        
        sinon.stub(User,'findOne');
        User.findOne.throws();

        const req = {
            body: {
                userId: '123',
                password: '123456',
                reEntryPassword: '123456',
            }
        };
        const next = function(err) {
            expect(err).to.have.property('errorMessage').that.equals('Error Occurs');
            expect(err).to.have.property('errorCode').that.equals(500);
        };
        await userController.createUser(req, {}, next);

        User.findOne.restore();
    });

    it('Testing create user -- should return success if user created', async function(){
        
        sinon.stub(User,'findOne');
        sinon.stub(User,'create');
        sinon.stub(Role, 'find');
        User.findOne.returns(null);
        User.create.resolves();
        Role.find.returns(['role']);

        const req = {
            body: {
                userId: '123',
                password: '123456',
                reEntryPassword: '123456'
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

        await userController.createUser(req, res, () => {});

        expect(res.statusCode).to.be.equal(201);
        expect(res.returnMessage).to.be.equal('User Created');

        User.findOne.restore();
        User.create.restore();
        Role.find.restore();
    });

    it('Testing update user -- should throw error if the user id in the request is empty', async function(){
        const req = {
            body: {
                userId: null,
                password: '1234',
                reEntryPassword: '1234'
            }
        };
        const next = function(err) {
            expect(err).to.have.property('errorMessage').that.equals('Please enter userId');
            expect(err).to.have.property('errorCode').that.equals(401);
        };
        await userController.updateUser(req,{},next);
    });

    it('Testing update user -- should throw error if the password and reEntryPassword does not equal', async function(){
        const req = {
            body: {
                userId: '123',
                password: '12345',
                reEntryPassword: '1234'
            }
        };
        const next = function(err) {
            expect(err).to.have.property('errorMessage').that.equals('Password does not match');
            expect(err).to.have.property('errorCode').that.equals(401);
        };
        await userController.updateUser(req,{},next);
    });
    
    it('Testing update user -- should throw error if response code return is not 0', async function(){
        
        sinon.stub(User,'findById')
        User.findById.throws();
        
        const req = {
            body: {
                userId: '123',
                password: '12345',
                reEntryPassword: '12345'
            }
        };

        const next = function(err) {
            expect(err).to.have.property('errorMessage').that.equals('Error Occurs');
            expect(err).to.have.property('errorCode').that.equals(500);
        };

        await userController.updateUser(req, {}, next);

        User.findById.restore();
    });
    
    it('Testing update user -- should return success if user updated successfully', async function(){
        
        const mockUser = {
            userId: '123',
            password: '12345',
            reEntryPassword: '12345',
            status:'A',
            save: sinon.stub().resolves()
        };

        sinon.stub(User,'findOne');
        User.findOne.returns(mockUser);
        
        const req = {
            body: {
                userId: '123',
                password: '12345',
                reEntryPassword: '12345'
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
        
        await userController.updateUser(req, res, () => {});

        expect(res.statusCode).to.be.equal(200);
        expect(res.returnMessage).to.be.equal('User updated');

        User.findOne.restore();
    });
    
    it('Testing get user -- should throw error if response code return is not 0', async function(){
        
        sinon.stub(User,'find')
        User.find.throws();
        
        const req = {
            query: {
                userId: null
            }
        };

        const next = function(err) {
            expect(err).to.have.property('errorMessage').that.equals('Error Occurs');
            expect(err).to.have.property('errorCode').that.equals(500);
        };

        await userController.getUsers(req, {}, next);

        User.find.restore();
    });
    
    it('Testing get user -- should return success if get user successfully', async function(){

        sinon.stub(User,'find');
        User.find.returns({
            select: sinon.stub().returns(['123'])
        });
        
        const req = {
            query: {
                userId: null
            }
        };

        const res = {
            statusCode: 500,
            returnUsers: null,
            status: function(code) {
              this.statusCode = code;
              return this;
            },
            json: function(data) {
              this.returnUsers = data.users;
            }
        };
        
        await userController.getUsers(req, res, () => {});
        
        expect(res.statusCode).to.be.equal(200);
        expect(res.returnUsers).to.deep.equals(['123']);

        User.find.restore();
    });
    
    it('Testing delete user -- should throw error if response code return is not 0', async function(){
        
        sinon.stub(User,'findOne')
        User.findOne.throws();
        
        const req = {
            body: {
                userId: '123'
            }
        };

        const next = function(err) {
            expect(err).to.have.property('errorMessage').that.equals('Error Occurs');
            expect(err).to.have.property('errorCode').that.equals(500);
        };

        await userController.deleteUser(req, {}, next);

        User.findOne.restore();
    });
    
    it('Testing delete user -- should return success if user deleted successfully', async function(){

        const mockUser = {
            userId: '123',
            password: '1234',
            status: 'A',
            save: sinon.stub().resolves()
        };

        sinon.stub(User,'findOne');
        User.findOne.returns(mockUser);
        
        const req = {
            body: {
                userId :'123'
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
        
        await userController.deleteUser(req, res, () => {});

        expect(res.statusCode).to.be.equal(200);
        expect(res.returnMessage).to.be.equals('User Deleted');

        User.findOne.restore();
    });

    after(function() {
        return mongoose.disconnect();
    });
})