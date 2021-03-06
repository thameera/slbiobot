'use strict';

/*
 * userlist
 * Reads, operates on and writes back users list
 */

let fs = require('fs');

const DEFAULT_FILE_NAME = 'users.txt';

const Userlist = class {
  constructor(filename) {
    this.filename = filename || DEFAULT_FILE_NAME;
    const contents = fs.readFileSync(this.filename, 'utf-8');
    this.users = contents.split('\n')
      .filter( s => !!s )
      .map( s => Number(s) );
  }

  doesUserExist(userid) {
    return this.users.indexOf(userid) >= 0;
  }

  appendUser(userid) {
    if (!this.doesUserExist(userid)) {
      this.users.push(userid);
    }
  }

  removeUser(userid) {
    this.users = this.users.filter( u => u !== userid );
  }

  save() {
    const contents = this.users.map( id => id + '\n' ).join('');
    fs.writeFileSync(this.filename, contents, 'utf-8');
  }
};

module.exports = Userlist;

