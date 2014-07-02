'use strict';
var lineitem = angular.module('lineitem', []);

lineitem.config(function ($modalProvider) {
  // Modal config
  angular.extend($modalProvider.defaults, {
    container: 'body',
    placement: 'center',
    animation: 'animation-fadeAndScale',
    template: 'uploadAdsModal.tpl.html',
    html: true,
    show: false
  });
});
