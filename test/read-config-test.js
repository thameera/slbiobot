'use strict';

const chai = require('chai');
const rewire = require('rewire');

const should = chai.should();

const readConfig = rewire('../scripts/lib/read-config');

describe('ReadConfig tests', function() {
  const filename = 'config.ini';
  const fsMock = {
    readFileSync: (path) => {
      should.exist(path);
      path.should.equal(filename);
      return '[Twitter]\nCKey=abc\nCSec=pqr\n';
    }
  };

  it('should return a config object', function() {
    let revert = readConfig.__set__('fs', fsMock);

    let config = readConfig(filename);

    should.exist(config);
    should.exist(config.Twitter);

    should.exist(config.Twitter.CKey);
    config.Twitter.CKey.should.equal('abc');

    should.exist(config.Twitter.CSec);
    config.Twitter.CSec.should.equal('pqr');

    revert();
  });

  it('should throw error when invalid file name is given', function() {
    (function() {
      let config = readConfig('abc');
    }).should.throw.error;
  });
});

