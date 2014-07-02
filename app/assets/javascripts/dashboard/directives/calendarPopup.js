app.directive('calendarPopup', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      element.on('keydown', function (event) {
        if (event.keyCode === 9) {
          element.next().css('display', 'none');
        }
      });

      element.on('focusin', function (event) {
        element.next().css('display', 'block');
      });
    }
  };
});
