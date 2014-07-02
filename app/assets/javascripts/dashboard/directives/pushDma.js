// TODO: Refactor both these directives into one

app.directive('pushDma', function ($timeout, $alert, StaticData) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      element.on('keydown', function (event) {
        if (event.keyIdentifier === 'Enter') {
          $timeout(function () {
            var dma  = element.val().match(/\d{3}/)[0];

            if (scope.lineitem && scope.lineitem.target_geo_dmas) {
              var dmas = scope.lineitem.target_geo_dmas;

              // Push into target_geo_dmas, if unique
              if (_(dmas).contains(dma)) {
                $alert(StaticData.growl({
                  type: 'warning',
                  title: 'Notice',
                  message: 'DMA already in collection'
                }));
              } else {
                dmas.push(dma);
                scope.dmaDesc.push(element.val());
                $alert(StaticData.growl({
                  type: 'success',
                  title: 'Success',
                  message: 'DMA added.'
                }));
              }
            } else if (scope.schedule && scope.schedule.dma) {
              var dmas = scope.schedule.dma;
              if (dmas.length) {
                $alert(StaticData.growl({
                  type: 'warning',
                  title: 'Notice',
                  message: 'A TV Schedule corresponds to only one DMA.'
                }));
              } else {
                dmas.push(dma);
                scope.dmaDesc.push(element.val());
                $alert(StaticData.growl({
                  type: 'success',
                  title: 'Success',
                  message: 'DMA added.'
                }));
              }
            }

            // Clear input field
            element.val('');

          }, 0);
        }
      });
    }
  };
});
