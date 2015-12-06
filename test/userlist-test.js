'use strict';

const chai = require('chai');
const rewire = require('rewire');

const should = chai.should();

const Userlist = rewire('../scripts/lib/userlist');

describe('Userlist tests', function() {
  const filename = 'users.txt';
  const fsMock = {
    readFileSync: (path) => {
      should.exist(path);
      path.should.equal(filename);
      return '26748463\n32765419\n26442541\n';
    },
    writeFileSync: (path, contents) => {
      should.exist(path);
      path.should.equal(filename);
      should.exist(contents);
      contents.should.equal('26748463\n32765419\n26442541\n');
    }
  };

  it('should load users file without errors', function() {
    const revert = Userlist.__set__('fs', fsMock);

    (function() {
      const userlist = new Userlist(filename);
    }).should.not.throw();

    revert();
  });

  it('should throw when invalid file name is given', function() {
    (function() {
      const userlist = new Userlist('abc');
    }).should.throw();
  });

  describe('doesUserExist', function() {
    let userlist, revert;

    beforeEach( () => {
      revert = Userlist.__set__('fs', fsMock);
      userlist = new Userlist(filename);
    });

    afterEach( () => {
      revert();
    });

    it('should return true when user exists', function() {
      userlist.doesUserExist(32765419).should.be.true;
    });

    it('should return false when user does not exist', function() {
      userlist.doesUserExist(49125753).should.be.false;
    });
  });

  describe('appendUser', function() {
    let userlist, revert;

    beforeEach( () => {
      revert = Userlist.__set__('fs', fsMock);
      userlist = new Userlist(filename);
    });

    afterEach( () => {
      revert();
    });

    it('should append user to list', function() {
      userlist.appendUser(42);
      userlist.doesUserExist(42).should.be.true;
    });
  });

  describe('save', function() {
    let userlist, revert;

    beforeEach( () => {
      revert = Userlist.__set__('fs', fsMock);
      userlist = new Userlist(filename);
    });

    afterEach( () => {
      revert();
    });

    it('should append user to list', function() {
      userlist.save();
    });
  });

});

