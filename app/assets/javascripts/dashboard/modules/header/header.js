'use strict';
angular.module('header', [])
.controller('Header', function ($scope) {
  $scope.headerLinks = [
    {name: 'Campaigns', icon: 'icon-star-empty', domId: 'campaigns', route: '/campaigns'},
    {name: 'Library', icon: 'icon-briefcase', domId: 'library', route: '/library'},
    {name: 'Analytics', icon: 'icon-bar-chart', domId: 'analytics', route: '/analytics'}
  ];
});
