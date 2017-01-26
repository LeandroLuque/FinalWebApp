'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Personal = mongoose.model('Personal'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  personal;

/**
 * Personal routes tests
 */
describe('Personal CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Personal
    user.save(function () {
      personal = {
        name: 'Personal name'
      };

      done();
    });
  });

  it('should be able to save a Personal if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Personal
        agent.post('/api/personals')
          .send(personal)
          .expect(200)
          .end(function (personalSaveErr, personalSaveRes) {
            // Handle Personal save error
            if (personalSaveErr) {
              return done(personalSaveErr);
            }

            // Get a list of Personals
            agent.get('/api/personals')
              .end(function (personalsGetErr, personalsGetRes) {
                // Handle Personals save error
                if (personalsGetErr) {
                  return done(personalsGetErr);
                }

                // Get Personals list
                var personals = personalsGetRes.body;

                // Set assertions
                (personals[0].user._id).should.equal(userId);
                (personals[0].name).should.match('Personal name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Personal if not logged in', function (done) {
    agent.post('/api/personals')
      .send(personal)
      .expect(403)
      .end(function (personalSaveErr, personalSaveRes) {
        // Call the assertion callback
        done(personalSaveErr);
      });
  });

  it('should not be able to save an Personal if no name is provided', function (done) {
    // Invalidate name field
    personal.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Personal
        agent.post('/api/personals')
          .send(personal)
          .expect(400)
          .end(function (personalSaveErr, personalSaveRes) {
            // Set message assertion
            (personalSaveRes.body.message).should.match('Please fill Personal name');

            // Handle Personal save error
            done(personalSaveErr);
          });
      });
  });

  it('should be able to update an Personal if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Personal
        agent.post('/api/personals')
          .send(personal)
          .expect(200)
          .end(function (personalSaveErr, personalSaveRes) {
            // Handle Personal save error
            if (personalSaveErr) {
              return done(personalSaveErr);
            }

            // Update Personal name
            personal.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Personal
            agent.put('/api/personals/' + personalSaveRes.body._id)
              .send(personal)
              .expect(200)
              .end(function (personalUpdateErr, personalUpdateRes) {
                // Handle Personal update error
                if (personalUpdateErr) {
                  return done(personalUpdateErr);
                }

                // Set assertions
                (personalUpdateRes.body._id).should.equal(personalSaveRes.body._id);
                (personalUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Personals if not signed in', function (done) {
    // Create new Personal model instance
    var personalObj = new Personal(personal);

    // Save the personal
    personalObj.save(function () {
      // Request Personals
      request(app).get('/api/personals')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Personal if not signed in', function (done) {
    // Create new Personal model instance
    var personalObj = new Personal(personal);

    // Save the Personal
    personalObj.save(function () {
      request(app).get('/api/personals/' + personalObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', personal.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Personal with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/personals/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Personal is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Personal which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Personal
    request(app).get('/api/personals/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Personal with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Personal if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Personal
        agent.post('/api/personals')
          .send(personal)
          .expect(200)
          .end(function (personalSaveErr, personalSaveRes) {
            // Handle Personal save error
            if (personalSaveErr) {
              return done(personalSaveErr);
            }

            // Delete an existing Personal
            agent.delete('/api/personals/' + personalSaveRes.body._id)
              .send(personal)
              .expect(200)
              .end(function (personalDeleteErr, personalDeleteRes) {
                // Handle personal error error
                if (personalDeleteErr) {
                  return done(personalDeleteErr);
                }

                // Set assertions
                (personalDeleteRes.body._id).should.equal(personalSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Personal if not signed in', function (done) {
    // Set Personal user
    personal.user = user;

    // Create new Personal model instance
    var personalObj = new Personal(personal);

    // Save the Personal
    personalObj.save(function () {
      // Try deleting Personal
      request(app).delete('/api/personals/' + personalObj._id)
        .expect(403)
        .end(function (personalDeleteErr, personalDeleteRes) {
          // Set message assertion
          (personalDeleteRes.body.message).should.match('User is not authorized');

          // Handle Personal error error
          done(personalDeleteErr);
        });

    });
  });

  it('should be able to get a single Personal that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Personal
          agent.post('/api/personals')
            .send(personal)
            .expect(200)
            .end(function (personalSaveErr, personalSaveRes) {
              // Handle Personal save error
              if (personalSaveErr) {
                return done(personalSaveErr);
              }

              // Set assertions on new Personal
              (personalSaveRes.body.name).should.equal(personal.name);
              should.exist(personalSaveRes.body.user);
              should.equal(personalSaveRes.body.user._id, orphanId);

              // force the Personal to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Personal
                    agent.get('/api/personals/' + personalSaveRes.body._id)
                      .expect(200)
                      .end(function (personalInfoErr, personalInfoRes) {
                        // Handle Personal error
                        if (personalInfoErr) {
                          return done(personalInfoErr);
                        }

                        // Set assertions
                        (personalInfoRes.body._id).should.equal(personalSaveRes.body._id);
                        (personalInfoRes.body.name).should.equal(personal.name);
                        should.equal(personalInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Personal.remove().exec(done);
    });
  });
});
