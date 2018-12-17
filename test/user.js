const User = require('../auth');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const databaseConnector = require('../database');
chai.use(chaiHttp);

describe('Users', () => {
    databaseConnector.User.destroy({where: {}, truncate: false}).then(() => {
    }).then(() => done());;       
    var token;
    let userlogin = {
        username: "test",
        password: "test"
    }
    let userloginwrong = {
        username: "wrongtest",
        password: "test"
    }
    let userloginwrongpassword = {
        username: "test",
        password: "wrongtest"
    }
    let user = {
        username: "test",
        password: "test",
        firstname: "test",
        lastname: "Kell",
        email: "test@gmail.com"
    }
    let usernousername = {
        password: "test",
        firstname: "test",
        lastname: "Kell",
        email: "test@gmail.com"
    }
    let usernopassword = {
        username: "test3",
        firstname: "test",
        lastname: "Kell",
        email: "test@gmail.com"
    }
    
    describe('/POST user', () => {
        it('it should POST a user', (done) => {
            chai.request('http://localhost:3000')
            .post('/auth/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('token');
                done();
            });
        });
    });

    describe('/POST user', () => {
        it('it should not POST a user with existing username', (done) => {
            chai.request('http://localhost:3000')
            .post('/auth/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(409);
                done();
            });
        });
    });

    describe('/POST user', () => {
        it('it should not POST a user with no username', (done) => {
            chai.request('http://localhost:3000')
            .post('/auth/register')
            .send(usernousername)
            .end((err, res) => {
                res.should.have.status(422);
                done();
            });
        });
    });

    describe('/POST user', () => {
        it('it should not POST a user with no password', (done) => {
            chai.request('http://localhost:3000')
            .post('/auth/register')
            .send(usernopassword)
            .end((err, res) => {
                res.should.have.status(422);
                done();
            });
        });
    });

    describe('/POST user', () => {
        it('it should login a user', (done) => {
            chai.request('http://localhost:3000')
            .post('/auth/login')
            .send(userlogin)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('token');
                token = res.body.token;  
                done();
            });
        });
    });

    describe('/POST user', () => {
        it('it should not login a user with wrong username', (done) => {
            chai.request('http://localhost:3000')
            .post('/auth/login')
            .send(userloginwrong)
            .end((err, res) => {
                res.should.have.status(401); 
                done();
            });
        });
    });

    describe('/POST user', () => {
        it('it should not login a user with wrong password', (done) => {
            chai.request('http://localhost:3000')
            .post('/auth/login')
            .send(userloginwrongpassword)
            .end((err, res) => {
                res.should.have.status(401); 
                done();
            });
        });
    });

    describe('/GET user', () => {
        it('it should GET current user', (done) => {
            chai.request('http://localhost:3000')
            .get('/auth/payload')
            .set('Authorization', 'Bearer '+token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('username');
                done();
            });
        });
    });
});