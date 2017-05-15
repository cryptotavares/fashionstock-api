let mongoose = require("mongoose");
let User = require('../app/models/users');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

var token = '';

describe('/POST signup', () => {
    it('it should create a user', (done) => {
        let user = {
            name: 'TestUser',
            email: 'testuser@testuser.com',
            password: '12345Test!'
        };
        chai.request(server)
            .post('/api/signup')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.should.have.property('message').eql(`User ${user.name} created!`);
                done();
            });

    });
});

describe('/POST signin', () => {
    it('it should login a user and get the token', (done) => {
        let user = {
            name: 'TestUser',
            password: '12345Test!'
        };
        chai.request(server)
            .post('/api/signin')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.should.have.property('token');
                res.body.should.have.property('message').eql(`Enjoy your token`);
                token = res.body.token;
                done();
            });

    });
});

describe('/GET user', () => {
    it('it should not return the list of users since no token was sent', (done) => {
        chai.request(server)
            .get('/api/user')
            .end((err, res) => {
                res.should.have.status(403);
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.should.have.property('message').eql(`No token provided!`);
                done();
            });
    });

    it('it should get the list of users', (done) => {
        chai.request(server)
            .get('/api/user')
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.should.have.property('success').eql(true);
                res.body.should.have.property('results');
                res.body.results.should.be.a('array');
                done();
            });
    });
});

describe('/DELETE User', () => {
    it('it should delete the user created for tests', (done) => {
        chai.request(server)
            .delete('/api/user')
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.should.have.property('success').eql(true);
                res.body.should.have.property('message').eql(`Successfully deleted!`);
                done();
            });
    });
});