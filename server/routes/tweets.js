"use strict";

const userHelper    = require("../lib/util/user-helper")

const express       = require('express');
const tweetsRoutes  = express.Router();

module.exports = function (DataHelpers) {

  //GET method for getting tweets.
  tweetsRoutes.get('/', (req, res) => {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message, source: 'getTweets @ tweets.js' });
      } else {
        res.json(tweets);
      }
    });
  });

  //CREATES A NEW TWEET WITH A UNIQUE USER ID AND SAVES TO DB.
  tweetsRoutes.post('/', (req, res) => {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    const user = req.body.user ? req.body.user : userHelper.generateRandomUser();
    const tweet = {
      user,
      content: {
        text: req.body.text,
      },
      created_at: Date.now(),
      like_count: 0,
    };

    // saves the tweets using Datahelper's saveTweet function to save into db.
    // returns the tweet that was posted for instant update on successful post.
    DataHelpers.saveTweet(tweet, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json(tweet);
      }
    });
  });

  // tweetsRoutes.get('/likes' (req, res) => {
  //   DataHelpers.getLikes((err, tweets) => {
  //     if (err) {
  //       res.status(500).json({ error: err.message, source: 'getLikes @ tweets.js'});
  //     } else {
  //       res.status(200).send();
  //     }
  //   });
  // });

  // TOGGLES THE LIKE COUNT INCREMENTATION AND DECREMENTATION.
  tweetsRoutes.post('/likes', (req, res) => {
    //console.log(req.body);

    DataHelpers.toggleLikes(req, (err, tweet) => {
      if (err) {
        res.status(500).json({ error: err.message, source: 'postLikes @ tweets.js'});
      } else {
        res.status(200).json(tweet);
      }
    });
  });


  return tweetsRoutes;

}
