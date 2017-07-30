'use strict';

/*
 * blacklist
 * Reads, operates on and writes back blacklist
 */

let fs = require('fs');

const DEFAULT_FILE_NAME = 'blacklist.txt';

const Blacklist = class {
  constructor(filename) {
    this.filename = filename || DEFAULT_FILE_NAME;
    const contents = fs.readFileSync(this.filename, 'utf-8');
    this.users = contents.split('\n')
      .filter( s => !!s )
      .map( s => Number(s) );
  }

  isBlacklisted(userid) {
    return this.users.includes(userid);
  }

  blacklistUser(userid) {
    if (!this.isBlacklisted(userid)) {
      this.users.push(userid);
    }
  }

  save() {
    const contents = this.users.map( id => id + '\n' ).join('');
    fs.writeFileSync(this.filename, contents, 'utf-8');
  }
};

module.exports = Blacklist;

