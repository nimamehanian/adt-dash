app.directive('commaSeparate', function ($filter) {
  var commaSeparate = $filter('commaSeparate');

  return {
    restrict: 'A',
    require: 'ngModel',
    scope: { ngModel: '=' },

    link: function (scope, element, attrs, ngModelController) {
      // log(scope);
      // ngModelController.$parsers.push(function (viewValue) {
      //   log('parsing');
      //   return viewValue ? +viewValue.split(',').join('') : 0;
      // });

      // ngModelController.$formatters.push(function (modelValue) {
      //   log('formatting');
      //   return commaSeparate(modelValue);
      // });

      // ngModelController.$render = function () {
      //   log('rendering');
      //   element.val(ngModelController.$viewValue);
      // };

      // scope.$watch(function () {
      //   return ngModelController.$modelValue;
      // }, function (value) {
      //   log('watch');
      //   ngModelController.$setViewValue(value);
      // });

    }
  };
});
