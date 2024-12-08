import {expect} from 'chai';
import sinon from 'sinon';
import * as emailController from '../controllers/emailController.js';
import { Resend } from 'resend';

describe('Testing of email controller', async function() {

    it('Testing send email -- should throw error if subject is missing', async function(){
        
        const req = {
            body: {
                message :'Test email message'
            }
        };

        const next = function(err) {
            expect(err).to.have.property('errorMessage').that.equals('Missing subject');
            expect(err).to.have.property('errorCode').that.equals(500);
        };
        await emailController.sendEmail(req, {}, next);

    });

    it('Testing send email -- should throw error if message is missing', async function(){
        
        const req = {
            body: {
                subject :'Test email subject'
            }
        };

        const next = function(err) {
            expect(err).to.have.property('errorMessage').that.equals('Missing message');
            expect(err).to.have.property('errorCode').that.equals(500);
        };
        await emailController.sendEmail(req, {}, next);

    });
    
})