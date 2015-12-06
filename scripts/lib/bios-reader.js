'use strict';

/*
 * bios-reader
 * Reads the bios file and does operations on its contents
 */

let fs = require('fs');

const DEFAULT_FILE_NAME = 'bios.txt';

const BiosReader = class {
  constructor(filename) {
    filename = filename || DEFAULT_FILE_NAME;
    this.contents = fs.readFileSync(filename, 'utf-8');
  }

  usernameExists(name) {
    // Names are in the every second row of each three rows
    const names = this.contents.split('\n')
      .filter( (val, id) => id % 3 === 1 )
      .map( (s) => s.toLowerCase() );

    return names.indexOf(name.toLowerCase()) >= 0;
  }
};

module.exports = BiosReader;

