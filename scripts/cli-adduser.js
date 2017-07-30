#!/usr/bin/env node

'use strict';

/*
 * cli-adduser
 * Adds given users to users.txt if they don't already exist there
 * USAGE: ./cli-adduser.js user1 user2 ...
 */

const program = require('commander');
const chalk = require('chalk');

const BiosReader = require('./lib/bios-reader');
const readConfig = require('./lib/read-config');
const Twitter = require('./lib/twitter');
const Userlist = require('./lib/userlist');
const Blacklist = require('./lib/blacklist');

const biosReader = new BiosReader();
const config = readConfig().Twitter;
const twitter = new Twitter(config);
const userlist = new Userlist();
const blacklist = new Blacklist();

let usernames;

const error = msg => {
  console.error(chalk.red(`ERROR: ${msg}`));
};

const warn = msg => {
  console.error(chalk.yellow(msg));
};

const info = msg => {
  console.log(chalk.cyan(msg));
}

program
  .arguments('[username...]')
  .action( (names) => { usernames = names; } )
  .parse(process.argv);

if (!usernames || !usernames.length) {
  error('No usernames given');
  process.exit(1);
}

usernames.forEach( username => {
  if (biosReader.usernameExists(username)) {
    warn(`'${username}' already exists`);
    return;
  }

  twitter.getIDByScreenName(username)
    .then( id => {
      if (blacklist.isBlacklisted(id)) {
        warn(`'${username}' is blacklisted`);
        return;
      }
      userlist.appendUser(id);
      userlist.save();
      info(`'${username}' added`);
    })
    .catch( err => {
      error(err);
    });
});

