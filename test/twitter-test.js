'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const should = chai.should();

const Twitter = require('../scripts/lib/twitter');

const readConfig = require('../scripts/lib/read-config');
const config = readConfig('./scripts/config.ini').Twitter;

describe('Twitter tests', function() {

  this.timeout(10000);

  it('should initialize without errors', function() {
    (function() {
      const twitter = new Twitter(config);
    }).should.not.throw();
  });

  describe('getIDByScreenName', function() {
    it('should send correct ID for given username', function(done) {
      const twitter = new Twitter(config);
      return twitter.getIDByScreenName('thameera').should.eventually.equal(35197394).notify(done);
    });

    it('should throw error on invalid username', function(done) {
      const twitter = new Twitter(config);
      return twitter.getIDByScreenName('a b').should.be.rejected.notify(done);
    });
  });

});

