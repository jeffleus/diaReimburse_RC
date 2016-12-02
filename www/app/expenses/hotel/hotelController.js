angular.module('starter.controllers')

.controller('HotelCtrl', function($scope, $log, HotelExp, TripSvc) {
    //controller state object to connect to form object in the view
    $scope.vm = {};
    $scope.$on('modal.shown', function() {
        $log.log('Hotel Controller...');
        if (!$scope.newHotel) {
            //init a new HotelExp when adding a new hotel Expense
            $scope.newHotel = new HotelExp();
        } else {
            //grab reference to the original hotel and make a copy to work on
            $scope.original = $scope.newHotel;
            $scope.newHotel = angular.copy($scope.original);
        }
    });

    $scope.saveNew = function() {
        //dirty check the hotel form before trying to save the expense
        var isDirty = $scope.vm.hotelForm.$dirty;
        if (isDirty) {
            $log.log('ExpensesCtrl: save new expense');
            //check for new addExpense, or existing updateExpense
            if ($scope.isNewExpense) {
                TripSvc.currentTrip.addExpense($scope.newHotel);
            } else {
                //lookup the original expense in the trip [] of expenses
                var index = TripSvc.currentTrip.expenses.indexOf($scope.original);
                if (index > -1) {
                    //replace the original expense w/ newHotel
                    TripSvc.currentTrip.expenses[index] = $scope.newHotel;
                }
            }
            //save the record before closing
            TripSvc.currentTrip.save();
        }
        $scope.modal.hide();			
    };
});
