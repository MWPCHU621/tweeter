/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// takes in a tweet object, and returns a tweet <article> element containing
// the entire HTML structure of the tweet.


function renderTweet(tweets) {
  for (let tweet of tweets) {
    $('.tweet-container').prepend(createTweetElement(tweet));

    // ajax button for toggling tweets
    const tweetId = '#' + tweet._id;
    const fullTweetId = tweetId + ' .social-icons__like-button';
    $(fullTweetId).on('click', (e) => {
      e.preventDefault();
      if ($(fullTweetId).css('color') === 'rgb(0, 0, 0)') {
        $.ajax('/tweets/likes', { method: 'POST', data: { id: tweet._id, value: 1 } })
          .then((t) => {
            $(fullTweetId).css('color', 'red');
            updateLikeCount(t.like_count);
          });
      } else {
        $.ajax('/tweets/likes', { method: 'POST', data: { id: tweet._id, value: -1 } })
          .then((t) => {
            $(fullTweetId).css('color', 'black');
            updateLikeCount(t.like_count);
          });
      }
    });
  }
}

function updateLikeCount(num) {
    console.log(num);
    $('.social-icons__like-count').text(num);
}

function createTweetElement(tweet) {

  const $tweet = $('<article>').addClass('tweet').attr('id', tweet._id);

  // variables stored for parts of the tweet.
  const username = tweet.user.name;
  const iconImg = tweet.user.avatars.small;
  const handleName = tweet.user.handle;
  const tweetContent = tweet.content.text;
  const tweetTime = getDays(tweet.created_at);
  const likeCount = tweet.like_count;

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

  // container for footer icons.
  const $footerIcons = $('<div>').addClass('tweet-footer__social-icons');

  // social icons like retweet, like, report(flag).
  const $footerEditIcon = $('<i>').addClass('fas fa-retweet');
  const $footerFlagIcon = $('<i>').addClass('fas fa-flag');
  const $footerHeartIcon = $('<i>').addClass('fas fa-heart');

  // like count and buttons
  const $footerLikeCount = $('<label>').addClass('social-icons__like-count');
  const $footerLikeButton = $('<button>').addClass('social-icons__like-button');

  // appends the information into their respective elements
  $headerIcon.attr('src', iconImg);
  $headerUsername.text(username);
  $headerHandleName.text(handleName);
  $content.text(tweetContent);
  $footerTimestamp.text(tweetTime);
  $footerLikeCount.text(likeCount);

  // appends the above elements to their parents
  $header.append($headerIcon);
  $header.append($headerUsername);
  $header.append($headerHandleName);
  $body.append($content);
  $footerLikeButton.append($footerHeartIcon, $footerLikeCount);
  $footerIcons.append($footerFlagIcon, $footerEditIcon, $footerLikeButton);
  $footer.append($footerTimestamp, $footerIcons);

  // appends the parts of the tweet to the tweet container in order.
  $tweet.append($header);
  $tweet.append($body);
  $tweet.append($footer);




  return $tweet;
}

function getDays(timeString) {
  const ms = Number(timeString);
  const now = Date.now();
  const difference = now - ms;
  const fullDaysSinceEpoch = Math.floor(difference / 8.64e7);
  const fullHourSinceEpoch = Math.floor(difference / 3.6e6);
  const fullMinSinceEpoch = Math.floor(difference / 60000);

  // calculates how many days or weeks or months or years depending on
  // fullDaysSinceEpoch number.
  if (fullDaysSinceEpoch > 365) {
    return Math.floor(fullDaysSinceEpoch / 365) + ' years ago';
  } else if (fullDaysSinceEpoch > 31) {
    return Math.floor(fullDaysSinceEpoch / 365) + ' months ago';
  } else if (fullDaysSinceEpoch > 7) {
    return Math.floor(fullDaysSinceEpoch / 365) + ' weeks ago';
  } else /*if(fullDaysSinceEpoch > 0)*/ {
    return Math.floor(fullDaysSinceEpoch / 365) + ' days ago';
  }
}

$(() => {
  $('#new-tweet-ajax-handler').submit((e) => {
    e.preventDefault();
    const textBodyValue = $('#new-tweet-ajax-handler').find('textarea').val();
    $('.new-tweet__error-message').slideUp(500, () => {
      if (!textBodyValue) {
        $('.new-tweet__error-message').text('');
        $('.new-tweet__error-message').text('ERROR: Text body is empty.');
        $('.new-tweet__error-message').slideDown(500);
        return;
      } else if (textBodyValue.length > 140) {
        $('.new-tweet__error-message').text('');
        $('.new-tweet__error-message').text('ERROR: tweet length over limit.');
        $('.new-tweet__error-message').slideDown(500);
        return;
      }

      $.ajax('/tweets', { method: 'POST', data: $('#new-tweet-ajax-handler').serialize() })
        .then((tweet) => {
          $('.tweet-container').prepend(createTweetElement(tweet));
        });
    });
  });

  $('#toggleLike');

  // toggles the new tweet form on button click.
  $('#hide-tweet-form').on('click', () => {
    $('.new-tweet').slideToggle(500, () => {
      $('.new-tweet').find('textarea').focus();
    });
  });

  // $('#new-tweet__tweet').on('click', function() {
  //   $('.new-tweet__error-message').toggle(500);
  // });

  // toggles the text
  function loadTweets() {
    $.ajax('/tweets', { method: 'GET' })
      .then((data) => {
        renderTweet(data);
      });
  }



  /* given a status code of 0 or 1,
    return the appropriate label element containing the right error message
    status code 0 = textarea body is empty or null,
    status code 1 = text length in textarea body > 140.
  */
  function createErrorMessage(statusCode) {
    const $errorMessage = $('<label>').addClass('new-tweet__error-message');
    switch (statusCode) {
      case 0:
        $errorMessage.text('ERROR: Text body is empty.');
        break;
      case 1:
        $errorMessage.text('ERROR: text length over limit.');
        break;
      default:
        $errorMessage.text("'ERROR: Don't know what is wrong");
    }

    return $errorMessage;
  }


  loadTweets();
});