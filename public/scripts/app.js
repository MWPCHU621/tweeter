/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// takes in a tweet object, and returns a tweet <article> element containing
// the entire HTML structure of the tweet.

// Fake data taken from tweets.json
const data = [
  {
    user: {
      name: 'Newton',
      avatars: {
        small: 'https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png',
        regular: 'https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png',
        large: 'https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png',
      },
      handle: '@SirIsaac',
    },
    content: {
      text: 'If I have seen further it is by standing on the shoulders of giants',
    },
    created_at: 1461116232227,
  },
  {
    user: {
      name: 'Descartes',
      avatars: {
        small: 'https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png',
        regular: 'https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png',
        large: 'https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png',
      },
      handle: '@rd',
    },
    content: {
      text: 'Je pense , donc je suis',
    },
    created_at: 1461113959088,
  },
  {
    user: {
      name: 'Johann von Goethe',
      avatars: {
        small: 'https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png',
        regular: 'https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png',
        large: 'https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png',
      },
      handle: '@johann49',
    },
    content: {
      text: 'Es ist nichts schrecklicher als eine tätige Unwissenheit.',
    },
    created_at: 1461113796368,
  },
];

function renderTweet(tweets) {
  for (tweet of tweets) {
    $('.tweet-container').append(createTweetElement(tweet));
  }
}

function createTweetElement(tweet) {
  const $tweet = $('<article>').addClass('tweet');

  // variables stored for parts of the tweet.
  const username = tweet.user.name;
  const iconImg = tweet.user.avatars.small;
  const handleName = tweet.user.handle;
  const tweetContent = tweet.content.text;
  const tweetTime = tweet.created_at;

  // overarching elements for the tweet container
  const $header = $('<header>').addClass('tweet-header');
  const $body = $('<p>').addClass('tweet-content');
  const $footer = $('<footer>').addClass('tweet-footer');

  // individual elements for each variable that stores the hard data.
  const $headerIcon = $('<img>').addClass('tweet-header__profile-pic');
  const $headerUsername = $('<h2>').addClass('tweet-header__user-name');
  const $headerHandleName = $('<h5>').addClass('tweet-header__handle-name');
  const $content = $('<p>').addClass('tweet-content');
  const $footerTimestamp = $('<div>').addClass('tweet-footer__timestamp');

  // appends the information into their respective elements
  $headerIcon.attr('src', iconImg);
  $headerUsername.text(username);
  $headerHandleName.text(handleName);
  $content.text(tweetContent);
  $footerTimestamp.text(tweetTime);

  //appends the above elements to their parents
  $header.append($headerIcon);
  $header.append($headerUsername);
  $header.append($headerHandleName);
  $body.append($content);
  $footer.append($footerTimestamp);

  //appends the parts of the tweet to the tweet container in order.
  $tweet.append($header);
  $tweet.append($body);
  $tweet.append($footer);

  return $tweet;
}

// const $tweet = createTweetElement(tweetData);
// console.log($tweet);
// $('#tweet-container').append($tweet);

$(() => {
  renderTweet(data);
});

