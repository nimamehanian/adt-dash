app.directive('requireDropdown', function () {
  return {
    restrict: 'A',
    require: '^form',
    link: function (scope, element, attrs, formController) {
      // console.log(formController);
      // element.on('submit', function (event) {
      //   console.log(attrs.placeholder + ' is required');
      // });
    }
  };
});
