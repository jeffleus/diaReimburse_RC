angular.module('starter.controllers', ['ionic-timepicker'])

.controller('AppCtrl', function($scope, VersionSvc, $ionicModal, $timeout) {
    $scope.versionSvc = VersionSvc;
});
