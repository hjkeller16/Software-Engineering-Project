const User = require('../auth');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();
const databaseConnector = require('../database');


chai.use(chaiHttp);
//Our parent block
describe('Users', () => {



        databaseConnector.User.destroy({where: {}, truncate: false}).then(() => {
        }).then(() => done());;       
    

    /*describe('/GET user', () => {
        it('it should GET current user', (done) => {
          chai.request('http://localhost:3000')
              .get('/auth/payload')
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                done();
              });
        });
    });*/

    describe('/POST user', () => {
        it('it should POST a user', (done) => {
            let user = {
                username: "test2",
                password: "test1",
                firstname: "test1",
                lastname: "Keller",
                email: "test1@gmail.com"
            }
          chai.request('http://localhost:3000')
              .post('/auth/register')
              .send(user)
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('token');
                    //res.body.errors.should.have.property('password');
                    //res.body.errors.pages.should.have.property('username').eql('required');
                done();
              });
        });
  
    });
  
  });