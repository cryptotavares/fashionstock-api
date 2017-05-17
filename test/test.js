let mongoose = require("mongoose");
let User = require('../app/models/users');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

var token = '';
var supplierList = [];
var supplierGet = {};

// SIGNUP & SIGNINTESTS
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
                res.body.should.have.property('success').eql(true);
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
                res.body.should.have.property('success').eql(true);
                res.body.should.have.property('token');
                res.body.should.have.property('message').eql(`Enjoy your token`);
                token = res.body.token;
                done();
            });

    });
});


//GET List of Users negative and positive tests
describe('/GET user', () => {
    it('it should not return the list of users since no token was sent', (done) => {
        chai.request(server)
            .get('/api/user')
            .end((err, res) => {
                res.should.have.status(403);
                res.body.should.be.a('object');
                res.body.should.have.property('success').eql(false);;
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
                res.body.should.have.property('success').eql(true);
                res.body.should.have.property('results');
                res.body.results.should.be.a('array');
                done();
            });
    });
});

// TEST Suppliers
describe('/POST GET & PUT Suppliers', () => {

    it('it should create a new supplier', (done) => {
        let supplier = {
            name: 'TestSupplier',
            email: 'testsupplier@supplier.com',
            telephone: '217159952',
            address: 'Rua Professor Braço de Prata',
            city: 'Lisboa',
            country: 'Portugal'
        };
        chai.request(server)
            .post('/api/suppliers')
            .set('x-access-token', token)
            .send(supplier)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('success').eql(true);
                res.body.should.have.property('message').eql(`Supplier ${supplier.name} created!\n`);
                done();
            });
    });

    it('it should get the list of suppliers', (done) => {
        chai.request(server)
            .get('/api/suppliers')
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('success').eql(true);
                res.body.should.have.property('results');
                res.body.results.should.be.a('array');
                supplierList = res.body.results;

                if(supplierList.length > 1){
                    for(var i = 0; i < supplierList.length; i++){
                        if(supplierList[i].name == 'TestSupplier'){
                            supplierGet = supplierList[i];
                        }
                    }
                } else {
                    supplierGet = supplierList[0];
                }
                done();
            });
    });

    it('it should get the TestSupplier by ID', (done) => {
        chai.request(server)
            .get('/api/suppliers/' + supplierGet._id)
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('success').eql(true);
                res.body.should.have.property('results');
                done();
            });
    });

    it('it should update the TestSupplier', (done) => {
        let updateSupplier = {
            name: 'TestSupplier2',
            email: 'testsupplier@supplier.com',
            telephone: '217159952',
            address: 'New Street',
            city: 'Madrid',
            country: 'Spain',
            active: true
        };
        chai.request(server)
            .put('/api/suppliers/' + supplierGet._id)
            .set('x-access-token', token)
            .send(updateSupplier)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('success').eql(true);
                res.body.should.have.property('message').eql(`Supplier ${updateSupplier.name} updated!\n`);
                done();
            });
    });
});

//DELETE TEST Supplier
describe('/DELETE TEST Supplier', () => {
    it('it should delete the supplier created for tests', (done) => {
        chai.request(server)
            .delete('/api/suppliers/' + supplierGet._id)
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

//DELETE TEST user
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