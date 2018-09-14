'use strict';
const {ObjectId} = require('mongodb');

// Simulates the kind of delay we see with network or filesystem operations
const simulateDelay = require('./util/simulate-delay');

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {
    //Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      db.collection('tweets').insert(newTweet);
      callback(null, true);
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: (callback) => {
      db.collection('tweets').find().sort({ created_at: 1 })
      .toArray((err, result) => {
          // Lazy error handling:
          if (err) throw err;

          callback(null, result);
      });
    },

    // save likes
    toggleLikes: (tweet, callback) => {
      db.collection('tweets').findOneAndUpdate({ _id: ObjectId(tweet.body.id) }, { $inc: { like_count: Number(tweet.body.value) } },{returnOriginal: false, }, (err, result) => {
        //console.log(result.value.like_count);
        callback(null, result.value);
      });
      // db.collection('tweets').update({'_id': tweet.body.id}, {like_count: })

    }
  }
}