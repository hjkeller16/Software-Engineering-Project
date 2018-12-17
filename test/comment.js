const Location = require('./location');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const Comment = require('./comment');
const databaseConnector = require('../database');
chai.use(chaiHttp);

describe('Comments', () => {
    databaseConnector.Comment.destroy({where: {}, truncate: false}).then(() => {
    }).then(() => done());; 
    let userlogin = {
        username: "test2",
        password: "test2"
    }
    let user = {
        username: "test2",
        password: "test2",
        firstname: "test2",
        lastname: "Keller2",
        email: "test2@gmail.com"
    }
    var token;
    let comment = {
        rating: 5, 
        content: 'great spot',
        location_id: 1
    }
    let location = {
        category: 'Fußball',
        name: 'test',
        description: 'test',
        address: 'Bayreuther Str. 25, 67059 Ludwigshafen am Rhein, Germany',
        lat: 49.4780691165434,
        lng: 8.4182114997526
    }
    var locationid;

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

    describe('/POST comment', () => {
        it('it should POST a comment', (done) => {
            chai.request('http://localhost:3000')
            .post('/comment/')
            .set('Authorization', 'Bearer '+token)
            .send(comment)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
        });
    });

    describe('/POST comment', () => {
        it('it should not POST a comment without authorization', (done) => {
            chai.request('http://localhost:3000')
            .post('/comment/')
            .send(comment)
            .end((err, res) => {
                res.should.have.status(500);
                done();
            });
        });
    });

    describe('/GET comment', () => {
        it('it should GET all the comments', (done) => {
            chai.request('http://localhost:3000')
            .get('/comment/')
            .set('Authorization', 'Bearer '+ token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
        });
    });

    describe('/GET comment', () => {
        it('it should not GET all the comments without authorization', (done) => {
            chai.request('http://localhost:3000')
            .get('/comment/')
            .end((err, res) => {
                res.should.have.status(500);
                done();
            });
        });
    });

    describe('/GET/:locationid comment for location', () => {
        it('it should GET all comments for a given location', (done) => {
            let locationtest = databaseConnector.Location.build(location);
            locationtest.save().then(() => {
                chai.request('http://localhost:3000')
                .get('/comment/')
                .set('locationid', locationtest.id)
                .set('Authorization', 'Bearer '+ token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
            });
        });
    });

    describe('/GET/:locationid comment for location', () => {
        it('it should not GET all comments for a given location without authorization', (done) => {
            let locationtest = databaseConnector.Location.build(location);
            locationtest.save().then(() => {
                chai.request('http://localhost:3000')
                .get('/comment/')
                .set('locationid', locationtest.id)
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
            });
        });
    });
});