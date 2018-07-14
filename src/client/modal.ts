export const initModal = () => {
  const $messageCloseButtons = Array.prototype.slice.call(
    document.querySelectorAll(".message-header .delete"),
    0
  );

  if ($messageCloseButtons.length > 0) {
    // Add a click event on each of them
    $messageCloseButtons.forEach($element => {
      $element.addEventListener("click", () => {
        let $currentElement = $element;
        for (let i = 0; i < 10; i++) {
          if (
            $currentElement.className === "columns" ||
            $currentElement.className === "flash"
          ) {
            break;
          }
          $currentElement = $currentElement.parentElement;
        }
        $currentElement.remove();
      });
    });
  }
};
