'use strict';

const chai = require('chai');
const rewire = require('rewire');

const should = chai.should();

const BiosReader = rewire('../scripts/lib/bios-reader');

describe('Bios-Reader tests', function() {
  const filename = 'bios.txt';
  const fsMock = {
    readFileSync: (path) => {
      should.exist(path);
      path.should.equal(filename);
      return '100\nthameeRa\nsome text\n205\njack\noh hi';
    }
  };

  it('should load a bios file without error', function() {
    let revert = BiosReader.__set__('fs', fsMock);

    (function() {
      let bios = new BiosReader(filename);
    }).should.not.throw();

    revert();
  });

  it('should throw when invalid file name is given', function() {
    (function() {
      let bios = new BiosReader('abc');
    }).should.throw();
  });

  describe('usernameExists', function() {
    let bios;
    let revert;

    beforeEach(() => {
      revert = BiosReader.__set__('fs', fsMock);
      bios = new BiosReader(filename);
    });

    afterEach(() => {
      revert();
    });

    it('should return true when username exists', function() {
      bios.usernameExists('jack').should.be.true;
    });

    it('should return true when username exists case-insensitive', function() {
      bios.usernameExists('Thameera').should.be.true;
    });

    it('should return false when username does not exist', function() {
      bios.usernameExists('soju').should.be.false;
    });
  });
});

