// Parent (table row)
app.directive('adtClick', function ($parse) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var fn = $parse(attrs.adtClick);
      element.on('click', function (event) {
        if (!scope.elementExempt) {
          scope.$apply(function () {
            fn(scope, {$event: event});
          });
        }
        scope.elementExempt = null;
      });
    }
  };
});

// Child (button within)
app.directive('adtExempt', function ($parse) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var fn = $parse(attrs.adtExempt);
      element.on('click', function (event) {
        scope.elementExempt = true;
        if (attrs.adtExempt) {
          scope.$apply(function () {
            fn(scope, {$event: event});
          });
        }
      });
    }
  };
});
