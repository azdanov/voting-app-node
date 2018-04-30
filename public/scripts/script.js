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
    $messageCloseButtons.forEach(function($element) {
      $element.addEventListener('click', function() {
        let $currentElement = $element;
        for (let i = 0; i < 10; i++) {
          if (
            $currentElement.className === 'columns' ||
            $currentElement.className === 'flash'
          ) {
            break;
          }
          $currentElement = $currentElement.parentElement;
        }
        $currentElement.remove();
      });
    });
  }
});
