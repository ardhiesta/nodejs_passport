var expect = require('chai').expect;
var app = require('../app');
var request = require('supertest');

//this test says: make a POST to the /login route with the email: admin, password: admin
//after the POST has completed, make sure the status code is 200 
//also make sure that the user has been directed to the / page

describe('GET /students', function(done){
  //let's set up the data we need to pass to the login method
  const userCredentials = {
    username: 'admin', 
    password: 'admin'
  }

  //now let's login the user before we run any tests
  var authenticatedUser = request.agent(app);

  before(function(done){
    authenticatedUser
      .post('/login')
      .set('Content-Type','application/x-www-form-urlencoded')
      .send(userCredentials)
      .expect(200)
      .end(function(err, response){
        // expect(response.statusCode).to.equal(200);
        expect('Location', '/');
        done();
      });
  });

  //addresses 1st bullet point: if the user is logged in we should get a 200 status code
  it('should return a 200 response if the user is logged in', function(done){
    authenticatedUser.get('/students')
    .expect(200, done);
  });

  //addresses 2nd bullet point: if the user is not logged in we should get a 302 response code and be directed to the /login page
  it('should return a 302 response and redirect to /login', function(done){
    request(app).get('/students')
    .expect('Location', '/login')
    .expect(302, done);
  });
});