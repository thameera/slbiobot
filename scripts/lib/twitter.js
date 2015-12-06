'use strict';

/*
 * twitter
 * Twitter API functions
 */

const Twit = require('twit');
const Promise = require('bluebird');

const Twitter = class {
  constructor(conf) {
    this.T = new Twit({
      consumer_key: conf.CKey,
      consumer_secret: conf.CSec,
      access_token: conf.AKey,
      access_token_secret: conf.ASec
    });
  }

  getIDByScreenName(name) {
    let deferred = Promise.pending();

    this.T.get('users/lookup', { screen_name: name },  function (err, data) {
      if (err) {
        deferred.reject(err);
      } else {
        if (!data || !data.length) deferred.reject('User not found');
        deferred.resolve(data[0].id);
      }
    });

    return deferred.promise;
  }
};

module.exports = Twitter;

