$(document).ready(() => {
  $('.new-vote-toggle').on('click', (event) => {
    $('.new-vote-composer').slideToggle().focus();
  });
});
