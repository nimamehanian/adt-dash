'use strict';
angular.module('footer', [])

.controller('Footer', function ($scope) {
  $scope.footerLinks = [
    {
      name: 'Report a bug',
      classname: 'pull-left btn-footer-left icon',
      id: 'button-bug',
      icon: 'icon-bug',
      route: '/'
    },
    {
      name: 'Feature Request',
      classname: 'pull-left btn-footer-left icon',
      id: 'button-feature',
      icon: 'icon-gamepad',
      route: '/'
    },
    {
      name: 'Help & Support',
      classname: 'pull-right btn-footer-right icon',
      id: 'button-support',
      icon: 'icon-question-sign',
      route: '/'
    },
    {
      name: 'Live Help',
      classname: 'pull-right btn-footer-right icon',
      id: 'button-help',
      icon: 'icon-comments',
      route: '/'
    }
  ];
});
