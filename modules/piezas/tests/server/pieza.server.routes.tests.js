'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Pieza = mongoose.model('Pieza'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  pieza;

/**
 * Pieza routes tests
 */
describe('Pieza CRUD tests', function () {

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

    // Save a user to the test db and create new Pieza
    user.save(function () {
      pieza = {
        name: 'Pieza name'
      };

      done();
    });
  });

  it('should be able to save a Pieza if logged in', function (done) {
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

        // Save a new Pieza
        agent.post('/api/piezas')
          .send(pieza)
          .expect(200)
          .end(function (piezaSaveErr, piezaSaveRes) {
            // Handle Pieza save error
            if (piezaSaveErr) {
              return done(piezaSaveErr);
            }

            // Get a list of Piezas
            agent.get('/api/piezas')
              .end(function (piezasGetErr, piezasGetRes) {
                // Handle Piezas save error
                if (piezasGetErr) {
                  return done(piezasGetErr);
                }

                // Get Piezas list
                var piezas = piezasGetRes.body;

                // Set assertions
                (piezas[0].user._id).should.equal(userId);
                (piezas[0].name).should.match('Pieza name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Pieza if not logged in', function (done) {
    agent.post('/api/piezas')
      .send(pieza)
      .expect(403)
      .end(function (piezaSaveErr, piezaSaveRes) {
        // Call the assertion callback
        done(piezaSaveErr);
      });
  });

  it('should not be able to save an Pieza if no name is provided', function (done) {
    // Invalidate name field
    pieza.name = '';

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

        // Save a new Pieza
        agent.post('/api/piezas')
          .send(pieza)
          .expect(400)
          .end(function (piezaSaveErr, piezaSaveRes) {
            // Set message assertion
            (piezaSaveRes.body.message).should.match('Please fill Pieza name');

            // Handle Pieza save error
            done(piezaSaveErr);
          });
      });
  });

  it('should be able to update an Pieza if signed in', function (done) {
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

        // Save a new Pieza
        agent.post('/api/piezas')
          .send(pieza)
          .expect(200)
          .end(function (piezaSaveErr, piezaSaveRes) {
            // Handle Pieza save error
            if (piezaSaveErr) {
              return done(piezaSaveErr);
            }

            // Update Pieza name
            pieza.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Pieza
            agent.put('/api/piezas/' + piezaSaveRes.body._id)
              .send(pieza)
              .expect(200)
              .end(function (piezaUpdateErr, piezaUpdateRes) {
                // Handle Pieza update error
                if (piezaUpdateErr) {
                  return done(piezaUpdateErr);
                }

                // Set assertions
                (piezaUpdateRes.body._id).should.equal(piezaSaveRes.body._id);
                (piezaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Piezas if not signed in', function (done) {
    // Create new Pieza model instance
    var piezaObj = new Pieza(pieza);

    // Save the pieza
    piezaObj.save(function () {
      // Request Piezas
      request(app).get('/api/piezas')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Pieza if not signed in', function (done) {
    // Create new Pieza model instance
    var piezaObj = new Pieza(pieza);

    // Save the Pieza
    piezaObj.save(function () {
      request(app).get('/api/piezas/' + piezaObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', pieza.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Pieza with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/piezas/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Pieza is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Pieza which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Pieza
    request(app).get('/api/piezas/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Pieza with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Pieza if signed in', function (done) {
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

        // Save a new Pieza
        agent.post('/api/piezas')
          .send(pieza)
          .expect(200)
          .end(function (piezaSaveErr, piezaSaveRes) {
            // Handle Pieza save error
            if (piezaSaveErr) {
              return done(piezaSaveErr);
            }

            // Delete an existing Pieza
            agent.delete('/api/piezas/' + piezaSaveRes.body._id)
              .send(pieza)
              .expect(200)
              .end(function (piezaDeleteErr, piezaDeleteRes) {
                // Handle pieza error error
                if (piezaDeleteErr) {
                  return done(piezaDeleteErr);
                }

                // Set assertions
                (piezaDeleteRes.body._id).should.equal(piezaSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Pieza if not signed in', function (done) {
    // Set Pieza user
    pieza.user = user;

    // Create new Pieza model instance
    var piezaObj = new Pieza(pieza);

    // Save the Pieza
    piezaObj.save(function () {
      // Try deleting Pieza
      request(app).delete('/api/piezas/' + piezaObj._id)
        .expect(403)
        .end(function (piezaDeleteErr, piezaDeleteRes) {
          // Set message assertion
          (piezaDeleteRes.body.message).should.match('User is not authorized');

          // Handle Pieza error error
          done(piezaDeleteErr);
        });

    });
  });

  it('should be able to get a single Pieza that has an orphaned user reference', function (done) {
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

          // Save a new Pieza
          agent.post('/api/piezas')
            .send(pieza)
            .expect(200)
            .end(function (piezaSaveErr, piezaSaveRes) {
              // Handle Pieza save error
              if (piezaSaveErr) {
                return done(piezaSaveErr);
              }

              // Set assertions on new Pieza
              (piezaSaveRes.body.name).should.equal(pieza.name);
              should.exist(piezaSaveRes.body.user);
              should.equal(piezaSaveRes.body.user._id, orphanId);

              // force the Pieza to have an orphaned user reference
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

                    // Get the Pieza
                    agent.get('/api/piezas/' + piezaSaveRes.body._id)
                      .expect(200)
                      .end(function (piezaInfoErr, piezaInfoRes) {
                        // Handle Pieza error
                        if (piezaInfoErr) {
                          return done(piezaInfoErr);
                        }

                        // Set assertions
                        (piezaInfoRes.body._id).should.equal(piezaSaveRes.body._id);
                        (piezaInfoRes.body.name).should.equal(pieza.name);
                        should.equal(piezaInfoRes.body.user, undefined);

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
      Pieza.remove().exec(done);
    });
  });
});
