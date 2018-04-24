document.addEventListener('DOMContentLoaded', function() {
  var $navbarBurgers = Array.prototype.slice.call(
    document.querySelectorAll('.navbar-burger'),
    0,
  );

  if ($navbarBurgers.length > 0) {
    $navbarBurgers.forEach(function($el) {
      $el.addEventListener('click', function() {
        var target = $el.dataset.target;
        var $target = document.getElementById(target);

        $el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
      });
    });
  }

  var $messageCloseButtons = Array.prototype.slice.call(
    document.querySelectorAll('.message-header .delete'),
    0,
  );

  if ($messageCloseButtons.length > 0) {
    // Add a click event on each of them
    $messageCloseButtons.forEach(function($el) {
      $el.addEventListener('click', function() {
        $el.parentElement.parentElement.remove();
      });
    });
  }
});
