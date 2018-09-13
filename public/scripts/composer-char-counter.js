$(document).ready(() => {
  $('.new-tweet textarea').on('input', (e) => {
    const length = $('.new-tweet textarea').val().length;
    const counter = $('.new-tweet__counter');
    // const value = Number(counter);
    let value = 140;
    if (e.keyCode === 8) {
      if (length < 140) {
        value = 140 - length;
      } else {
        value++;
      }
    } else {
      value = 140 - length;
    }

    counter.toggleClass('turn-red', (value < 0));

    counter.text(value);
  });
});