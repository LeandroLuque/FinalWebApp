'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Campana = mongoose.model('Campana'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  campana;

/**
 * Campana routes tests
 */
describe('Campana CRUD tests', function () {

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

    // Save a user to the test db and create new Campana
    user.save(function () {
      campana = {
        name: 'Campana name'
      };

      done();
    });
  });

  it('should be able to save a Campana if logged in', function (done) {
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

        // Save a new Campana
        agent.post('/api/campanas')
          .send(campana)
          .expect(200)
          .end(function (campanaSaveErr, campanaSaveRes) {
            // Handle Campana save error
            if (campanaSaveErr) {
              return done(campanaSaveErr);
            }

            // Get a list of Campanas
            agent.get('/api/campanas')
              .end(function (campanasGetErr, campanasGetRes) {
                // Handle Campanas save error
                if (campanasGetErr) {
                  return done(campanasGetErr);
                }

                // Get Campanas list
                var campanas = campanasGetRes.body;

                // Set assertions
                (campanas[0].user._id).should.equal(userId);
                (campanas[0].name).should.match('Campana name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Campana if not logged in', function (done) {
    agent.post('/api/campanas')
      .send(campana)
      .expect(403)
      .end(function (campanaSaveErr, campanaSaveRes) {
        // Call the assertion callback
        done(campanaSaveErr);
      });
  });

  it('should not be able to save an Campana if no name is provided', function (done) {
    // Invalidate name field
    campana.name = '';

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

        // Save a new Campana
        agent.post('/api/campanas')
          .send(campana)
          .expect(400)
          .end(function (campanaSaveErr, campanaSaveRes) {
            // Set message assertion
            (campanaSaveRes.body.message).should.match('Please fill Campana name');

            // Handle Campana save error
            done(campanaSaveErr);
          });
      });
  });

  it('should be able to update an Campana if signed in', function (done) {
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

        // Save a new Campana
        agent.post('/api/campanas')
          .send(campana)
          .expect(200)
          .end(function (campanaSaveErr, campanaSaveRes) {
            // Handle Campana save error
            if (campanaSaveErr) {
              return done(campanaSaveErr);
            }

            // Update Campana name
            campana.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Campana
            agent.put('/api/campanas/' + campanaSaveRes.body._id)
              .send(campana)
              .expect(200)
              .end(function (campanaUpdateErr, campanaUpdateRes) {
                // Handle Campana update error
                if (campanaUpdateErr) {
                  return done(campanaUpdateErr);
                }

                // Set assertions
                (campanaUpdateRes.body._id).should.equal(campanaSaveRes.body._id);
                (campanaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Campanas if not signed in', function (done) {
    // Create new Campana model instance
    var campanaObj = new Campana(campana);

    // Save the campana
    campanaObj.save(function () {
      // Request Campanas
      request(app).get('/api/campanas')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Campana if not signed in', function (done) {
    // Create new Campana model instance
    var campanaObj = new Campana(campana);

    // Save the Campana
    campanaObj.save(function () {
      request(app).get('/api/campanas/' + campanaObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', campana.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Campana with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/campanas/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Campana is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Campana which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Campana
    request(app).get('/api/campanas/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Campana with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Campana if signed in', function (done) {
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

        // Save a new Campana
        agent.post('/api/campanas')
          .send(campana)
          .expect(200)
          .end(function (campanaSaveErr, campanaSaveRes) {
            // Handle Campana save error
            if (campanaSaveErr) {
              return done(campanaSaveErr);
            }

            // Delete an existing Campana
            agent.delete('/api/campanas/' + campanaSaveRes.body._id)
              .send(campana)
              .expect(200)
              .end(function (campanaDeleteErr, campanaDeleteRes) {
                // Handle campana error error
                if (campanaDeleteErr) {
                  return done(campanaDeleteErr);
                }

                // Set assertions
                (campanaDeleteRes.body._id).should.equal(campanaSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Campana if not signed in', function (done) {
    // Set Campana user
    campana.user = user;

    // Create new Campana model instance
    var campanaObj = new Campana(campana);

    // Save the Campana
    campanaObj.save(function () {
      // Try deleting Campana
      request(app).delete('/api/campanas/' + campanaObj._id)
        .expect(403)
        .end(function (campanaDeleteErr, campanaDeleteRes) {
          // Set message assertion
          (campanaDeleteRes.body.message).should.match('User is not authorized');

          // Handle Campana error error
          done(campanaDeleteErr);
        });

    });
  });

  it('should be able to get a single Campana that has an orphaned user reference', function (done) {
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

          // Save a new Campana
          agent.post('/api/campanas')
            .send(campana)
            .expect(200)
            .end(function (campanaSaveErr, campanaSaveRes) {
              // Handle Campana save error
              if (campanaSaveErr) {
                return done(campanaSaveErr);
              }

              // Set assertions on new Campana
              (campanaSaveRes.body.name).should.equal(campana.name);
              should.exist(campanaSaveRes.body.user);
              should.equal(campanaSaveRes.body.user._id, orphanId);

              // force the Campana to have an orphaned user reference
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

                    // Get the Campana
                    agent.get('/api/campanas/' + campanaSaveRes.body._id)
                      .expect(200)
                      .end(function (campanaInfoErr, campanaInfoRes) {
                        // Handle Campana error
                        if (campanaInfoErr) {
                          return done(campanaInfoErr);
                        }

                        // Set assertions
                        (campanaInfoRes.body._id).should.equal(campanaSaveRes.body._id);
                        (campanaInfoRes.body.name).should.equal(campana.name);
                        should.equal(campanaInfoRes.body.user, undefined);

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
      Campana.remove().exec(done);
    });
  });
});
