'use strict';

const chai = require('chai');
const rewire = require('rewire');

const should = chai.should();

const Blacklist = rewire('../scripts/lib/blacklist');

describe('Blacklist tests', function() {
  const filename = 'blacklist.txt';
  const fsMock = {
    readFileSync: (path) => {
      should.exist(path);
      path.should.equal(filename);
      return '100\n101\n102\n';
    },
    writeFileSync: (path, contents) => {
      should.exist(path);
      path.should.equal(filename);
      should.exist(contents);
      contents.should.equal('100\n101\n102\n');
    }
  };

  it('should load blacklist file without errors', function() {
    const revert = Blacklist.__set__('fs', fsMock);

    (function() {
      const blacklist = new Blacklist(filename);
    }).should.not.throw();

    revert();
  });

  it('should throw when invalid file name is given', function() {
    (function() {
      const blacklist = new Blacklist('abc');
    }).should.throw();
  });

  describe('isBlacklisted', function() {
    let blacklist, revert;

    beforeEach( () => {
      revert = Blacklist.__set__('fs', fsMock);
      blacklist = new Blacklist(filename);
    });

    afterEach( () => {
      revert();
    });

    it('should return true when user exists', function() {
      blacklist.isBlacklisted(102).should.be.true;
    });

    it('should return false when user does not exist', function() {
      blacklist.isBlacklisted(200).should.be.false;
    });
  });

  describe('blacklistUser', function() {
    let blacklist, revert;

    beforeEach( () => {
      revert = Blacklist.__set__('fs', fsMock);
      blacklist = new Blacklist(filename);
    });

    afterEach( () => {
      revert();
    });

    it('should append user to list', function() {
      blacklist.blacklistUser(42);
      blacklist.isBlacklisted(42).should.be.true;
    });
  });

  describe('save', function() {
    let blacklist, revert;

    beforeEach( () => {
      revert = Blacklist.__set__('fs', fsMock);
      blacklist = new Blacklist(filename);
    });

    afterEach( () => {
      revert();
    });

    it('should append user to list', function() {
      blacklist.save();
    });
  });

});

