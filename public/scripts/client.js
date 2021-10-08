/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function() {

  /*
   * Convert the string to a text node
   * Returns the inner HTML of the created text node
   */
  const escape =  function(str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  /*
   * Converts tweet object to html article elements
   */
  const createTweetElement = function(tObj) {
    const $tweet = $("<article>").addClass("tweet");
    const daysAgo = daysSinceTweet(tObj["created_at"]);

    const innerHTML = `
          <header>
              <img src= ${tObj.user.avatars}>
              <span>${tObj.user.name}</span>
              <span class="handle">${tObj.user.handle}</span>
          </header>
           <span>${escape(tObj.content.text)}</span>
          <footer>
          <span>${daysAgo} days ago</span>
          <span class="interactOptions"><i class="fab fa-font-awesome-flag"></i><i class="fas fa-retweet"></i><i class="fas fa-heart"></i></span>
          </footer>
          `;

    $tweet.append(innerHTML);
    return $tweet;
  };

  const daysSinceTweet = function(epochOfTweet) {
    const currentDate = new Date();
    const currentTime = currentDate.getTime();
    const millisecondsInDay = 86400000;

    const timeDifference = currentTime - epochOfTweet;
    const dayDifference = timeDifference/millisecondsInDay;

    return Math.floor(dayDifference);
  };

  const renderTweets = function(tObjArr) {
    for (const tweet of tObjArr) {
      const $tweet = createTweetElement(tweet);
      $('section.all-tweets').prepend($tweet);
    }
  };

   /**
   * Makes a GET request to retrieve tweet history
   * Returns array of tweets
   */
  const loadTweets = function () {
    $.ajax('/tweets', { method: 'GET' })
    .then(function (allTweets) {
      renderTweets(allTweets);
    })
  };

  loadTweets();

   /**
   * Triggered on submission of the form with the class 'new-tweet'
   * Validate tweet length and display error message if required.
   * makes a POST request with form text to /tweets/
   * and then a GET request to /tweets/
   * Add new tweet to the page.
   */
  $('.new-tweet form').submit( function (event) {
    event.preventDefault();   
    $('.new-tweet p').empty().slideUp();
    const $form = $(this);
    const newTweetStr = $form.children('textarea').val();

    if (!newTweetStr) {
      $('.new-tweet p').append('<b>Error:</b> Tweet is empty! add some tweet.');
      setTimeout(() => {
        $('.new-tweet p').slideDown();
      }, 600);

    } else if (newTweetStr.length > 140) { 
      $('.new-tweet p').append("<b>Error:</b> Max 140 characteres are allowed!");
      setTimeout(() => {
        $('.new-tweet p').slideDown();
      }, 600);

    } else {
      $('.new-tweet p').slideUp();
      const tweet = $form.serialize();
      $.ajax({ url: "/tweets/", method: 'POST', data: tweet })
      .then (function () {
        return $.ajax('/tweets', { method: 'GET' })
      })
      .then (function (getReqArr) {
        $form[0].reset();
        $form.children('span').text(140);
        const newTweet = [getReqArr[getReqArr.length - 1]];
        renderTweets(newTweet);
      })
      .fail(function (err) {
        alert(err.responseJSON.error);
      })
    }
  });

  $('#compose-new button').click(function () {
    $('section.new-tweet').slideToggle("slow");
    $('section.new-tweet textarea').focus();
  })

});

