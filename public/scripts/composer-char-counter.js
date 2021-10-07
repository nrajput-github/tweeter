
$(document).ready(function() {
  // --- our code goes here ---
  $('.new-tweet textarea').on('input', function() {
  let newTweetLength = $(this).val().length;
  let nearbyCounter = $(this).siblings('.counter');
  const tweetLengthLimit = 140;

    if (newTweetLength > tweetLengthLimit) {
      nearbyCounter.addClass('tweetTooLong');
      //console.log(tweetLengthLimit);
    } else if (newTweetLength <= tweetLengthLimit) {
      nearbyCounter.removeClass('tweetTooLong');
    }
    nearbyCounter.text(tweetLengthLimit - newTweetLength);
  });
    
  });  

