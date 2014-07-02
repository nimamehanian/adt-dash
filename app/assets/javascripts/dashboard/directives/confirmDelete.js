app.directive('confirmDelete', function ($popover) {
  return {
    restrict: 'A',
    scope: {
      // keep: '&'
    },
    link: function (scope, element, attrs) {
      // element.on('click', function (e) {
        // $popover(element, {
        //   title: 'You are about to delete this item.',
        //   contentTemplate: 'confirmDelete.tpl.html',
        //   animation: 'animation-flipX',
        //   trigger: 'click',
        //   placement: 'left',
        //   html: true,
        //   show: true
        // });
      // });
    }
  };
});
