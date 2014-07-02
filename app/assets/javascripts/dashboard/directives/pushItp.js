app.directive('pushItp', function ($timeout, $alert, StaticData) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var validProtocols = ['http', 'https', 'itms', 'itms-apps'];

      element.on('keydown', function (event) {
        if (event.keyIdentifier === 'Enter') {
          $timeout(function () {
            var itps = scope.lineItemAd.impression_tracking_pixels;
            var itp  = element.val();

            // Push into impression_tracking_pixels, if unique
            if (_(itps).contains(itp)) {
              $alert(StaticData.growl({
                type: 'warning',
                title: 'Notice',
                message: 'Impression Tracking Pixel URL already in collection'
              }));
            } else if (!_(validProtocols).contains(itp.split('://')[0])) {
              $alert(StaticData.growl({
                type: 'warning',
                title: 'Notice',
                message: 'Impression Tracking Pixel URL must use a valid protocol (i.e., http, https, itms, itms-apps).'
              }));
            } else {
              if (itp.split('://')[1].length > 1) {
                itps.push(itp);
                $alert(StaticData.growl({
                  type: 'success',
                  title: 'Success',
                  message: 'Impression Tracking Pixel URL added.'
                }));
              } else {
                $alert(StaticData.growl({
                  type: 'danger',
                  title: 'Notice',
                  message: 'Impression Tracking Pixel URL is invalid.'
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
