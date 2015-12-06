'use strict';

/*
 * read-config
 * Reads the config file and returns a config object
 */

let fs = require('fs');
let ini = require('ini');

const DEFAULT_FILE_NAME = 'config.ini';

let readConfig = function(filename) {
  filename = filename || DEFAULT_FILE_NAME;
  const contents = fs.readFileSync(filename, 'utf-8');

  return ini.parse(contents);
};

module.exports = readConfig;

