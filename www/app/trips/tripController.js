angular.module('starter.controllers')

.controller('TripCtrl', function($scope, $state) {
    $scope.gotoTrips = function() {
        $state.go('app.trips');
    };
});