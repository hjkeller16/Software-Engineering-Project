const Location = require('./location');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();
const databaseConnector = require('../database');
const fs = require('fs');
chai.use(chaiHttp);

describe('Locations', () => {
    databaseConnector.Location.destroy({where: {}, truncate: false}).then(() => {
    }).then(() => done()); 
    var token = null;
    let user = {
        username: "test1",
        password: "test1"
    }
    let registeruser = {
        username: "test1",
        password: "test1",
        firstname: "test1",
        lastname: "Keller",
        email: "test1@gmail.com"
    }
    let location = {
        category: 'Fußball',
        name: 'test',
        description: 'test',
        address: 'Bayreuther Str. 25, 67059 Ludwigshafen am Rhein, Germany',
        lat: 49.4780691165434,
        lng: 8.4182114997526
    }
    let locationwithimage = {
        category: 'Fußball',
        name: 'testy',
        description: 'testy',
        address: 'Bayreuther Str. 5, 67059 Ludwigshafen am Rhein, Germany',
        lat: 51.4780691165434,
        lng: 10.4182114997526
    }
    let locationwocategory = {
        name: 'test',
        description: 'test',
        address: 'Bayreuther Str. 25, 67059 Ludwigshafen am Rhein, Germany',
        lat: 49.4780691165434,
        lng: 8.4182114997526
    }
    let locationwoaddress = {
        category: 'Fußball',
        name: 'test',
        description: 'test',
        lat: 49.4780691165434,
        lng: 8.4182114997526
    }
    let locationwoname = {
        category: 'Fußball',
        description: 'test',
        address: 'Bayreuther Str. 25, 67059 Ludwigshafen am Rhein, Germany',
        lat: 49.4780691165434,
        lng: 8.4182114997526
    }
    let search = {
        address: 'B',
        categories: ['Fußball', 'Basketball']
    }
    let search2 = {
        address: 'Bayre',
        categories: []

    }
    let search3 = {
        address: '',
        categories: ['Fußball', 'Basketball']
    }

    describe('/POST user', () => {
        it('it should POST a user', (done) => {
            chai.request('http://localhost:3000')
            .post('/auth/register')
            .send(registeruser)
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
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('token');
                token = res.body.token;
                describe('/POST location', () => {
                    it('it should POST a location', (done) => {
                        chai.request(server)
                        .post('/location/')
                        .set('Authorization', res.body.token)
                        .send(location)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            done();
                        });
                    });
                });
                done();
            });
        });
    });

    describe('/POST location', () => {
        it('it should POST a location with image', (done) => {
            chai.request(server)
            .post('/location/')
            .set('Authorization', 'Bearer '+ token)    
            .attach('file', fs.readFileSync('/Users/hannahkeller/Desktop/wald.jpeg'), 'wald.jpeg')
            .set('Content-Type', 'image')
            .send(locationwithimage)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
        });
    });

    describe('/POST location', () => {
        it('it should not POST a location without an address', (done) => {
            chai.request('http://localhost:3000')
            .post('/location/')
            .set('Authorization', 'Bearer '+ token)
            .send(locationwoaddress)
            .end((err, res) => {
                res.should.have.status(422);
                done();
            });
        });
    });

    describe('/POST location', () => {
        it('it should not POST a location without a name', (done) => {
            chai.request('http://localhost:3000')
            .post('/location/')
            .set('Authorization', 'Bearer '+ token)
            .send(locationwoname)
            .end((err, res) => {
                res.should.have.status(422);
                done();
            });
        });
    });

    describe('/POST location', () => {
        it('it should not POST a location without a category', (done) => {
            chai.request('http://localhost:3000')
            .post('/location/')
            .set('Authorization', 'Bearer '+ token)
            .send(locationwocategory)
            .end((err, res) => {
                res.should.have.status(422);
                done();
            });
        });
    });

    describe('/GET location', () => {
        it('it should GET all the locations', (done) => {
            chai.request('http://localhost:3000')
            .get('/location')
            .set('Authorization', 'Bearer '+ token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
        });
    });

    describe('/GET location', () => {
        it('it should not GET all the locations without authorization', (done) => {
            chai.request('http://localhost:3000')
            .get('/location')
            .end((err, res) => {
                res.should.have.status(500);
                done();
            });
        });
    });

    describe('/POST location', () => {
        it('it should not POST a location without authorization', (done) => {
           chai.request('http://localhost:3000')
           .post('/location/')
           .send(location)
           .end((err, res) => {
                res.should.have.status(500);
                done();
           });
       });
    });

    describe('/GET/:id location', () => {
        it('it should GET a location by the given id', (done) => {
            let testlocation = databaseConnector.Location.build(location);
            testlocation.save().then(() => {
                chai.request('http://localhost:3000')
                .get('/location/' + testlocation.id)
                .set('Authorization', 'Bearer '+ token)
                .send(testlocation)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id').eql(testlocation.id);
                    done();
                });
            });
        });
    });

    describe('/GET/:id location', () => {
        it('it should not GET a location by the given id without authentication', (done) => {
            let testlocation = databaseConnector.Location.build(location);
            testlocation.save().then(() => {
                chai.request('http://localhost:3000')
                .get('/location/' + testlocation.id)
                .send(testlocation)
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
            });
        });
    });

    describe('/POST search location', () => {
        it('it should search a location for address/title and category', (done) => {
            chai.request('http://localhost:3000')
            .post('/location/search')
            .set('Authorization', 'Bearer '+ token)
            .send(search)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(2);
                done();
            });
        });
    });

    describe('/POST search location', () => {
        it('it should not search a location for address/title and category without authorization', (done) => {
            chai.request('http://localhost:3000')
            .post('/location/search')
            .send(search)
            .end((err, res) => {
                res.should.have.status(500);
                done();
            });
        });
    });

    describe('/POST search location', () => {
        it('it should search a location for address/title', (done) => {
            chai.request('http://localhost:3000')
            .post('/location/search')
            .set('Authorization', 'Bearer '+ token)
            .send(search2)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(2);
                done();
            });
        });
    });

    describe('/POST search location', () => {
        it('it should not search a location for address/title without authorization', (done) => {
            chai.request('http://localhost:3000')
            .post('/location/search')
            .send(search2)
            .end((err, res) => {
                res.should.have.status(500);
                done();
            });
        });
    });

    describe('/POST search location', () => {
        it('it should search a location for category', (done) => {
            chai.request('http://localhost:3000')
            .post('/location/search')
            .set('Authorization', 'Bearer '+ token)
            .send(search3)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(2);
                done();
            });
        });
    });

    describe('/POST search location', () => {
        it('it should not search a location for category without authorization', (done) => {
            chai.request('http://localhost:3000')
            .post('/location/search')
            .send(search3)
            .end((err, res) => {
                res.should.have.status(500);
                done();
            });
        });
    });

    describe('/DELETE/:id location', () => {
        it('it should DELETE a location given the id', (done) => {
            let deletelocation = {
                category: 'Fußball',
                name: 'test1',
                description: 'test1',
                address: 'Bayreuther Str. 24, 67059 Ludwigshafen am Rhein, Germany',
                lat: 50.4780691165434,
                lng: 9.4182114997526,
                user_id: 'test1'
            }
            let deletetestlocation = databaseConnector.Location.build(deletelocation);
            deletetestlocation.save().then(() => {
                chai.request('http://localhost:3000')
                .delete('/location/' + deletetestlocation.id)
                .set('Authorization', 'Bearer '+ token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
            });
        });
    });

    describe('/DELETE/:id location', () => {
        it('it should not DELETE a location given the id if I am not the location creator', (done) => {
            let deletelocation = {
                category: 'Fußball',
                name: 'test1',
                description: 'test1',
                address: 'Bayreuther Str. 24, 67059 Ludwigshafen am Rhein, Germany',
                lat: 50.4780691165434,
                lng: 9.4182114997526,
            }
            let deletetestlocation = databaseConnector.Location.build(deletelocation);
            deletetestlocation.save().then(() => {
                chai.request('http://localhost:3000')
                .delete('/location/' + deletetestlocation.id)
                .set('Authorization', 'Bearer '+ token)
                .end((err, res) => {
                    console.log("the delete location id is" + deletetestlocation.id);
                    res.should.have.status(403);
                    done();
                });
            });
        });
    });
});