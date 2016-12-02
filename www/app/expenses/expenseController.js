angular.module('starter.controllers')

.controller('ExpenseCtrl', function($scope, $state, $timeout, $ionicActionSheet, $ionicModal, $ionicPopup
                                     , AirfareExp, HotelExp, TripSvc, ReportSvc, EmailSvc) {
    $scope.expenseTypes = ['Airfare','Hotel','Ground','Mileage','Meals','Miscellaneous'];
    $scope.tripSvc = TripSvc;
    $scope.expenses = [];
    $scope.isNewExpense = false;
    
    $scope.addExpenseSheet = _addExpenseSheet;    
    $scope.showExpenseModal = _showExpenseModal;
    $scope.sendTrip = _sendTrip;
    $scope.modals = [];
//    _loadAirfareModal();
//    _loadHotelModal();
//    _loadMealsModal();
//    _loadMiscModal();
//    _loadTransportationModal();
                
    //
    // Load Modal Content and Animation
    //
    $ionicModal.fromTemplateUrl('templates/expenseModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.expenseModal = modal;
      });		

    $scope.cancelNew = function() {
        console.log('ExpensesCtrl: cancel new expense');
        $scope.modal.hide();
    };
    $scope.deleteExpense = function(exp) {
        TripSvc.currentTrip.deleteExpense(exp);
        //moved the save call to the trip object
        //TripSvc.pause();
    };
    //
    // Modal event model: destroy, hide and remove
    //
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.expenseModal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hide', function() {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
    });
    
    function _addExpenseSheet() {
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: 'Airfare' },
                { text: 'Hotel' },
                { text: 'Ground' },
                { text: 'Mileage' },
                { text: 'Entertainment Meals' },
                { text: 'Miscellaneous' },
                { text: 'per Diem' },
            ],
            titleText: 'Add Expense',
            cancelText: 'Cancel',
            cancelFunc: function() {
            },
            buttonClicked: function(index) {
                hideSheet();
                console.log('expense modal index: ' + index);
                if (index == 6) $state.go('app.single.dates');
                _showExpenseModal(index);
                return true;
            }
        });
        //safety net timeout call to hide the action sheet if no input after 3sec
        $timeout(function() {
            hideSheet();
        }, 3000);
    }
           
    function _showExpenseModal(index, exp) {
        if (!exp) { 
            $scope.isNewExpense = true;
        } else $scope.isNewExpense = false;
        switch(index) {
            case 0:
                $scope.newAirfare = exp;
                _loadAirfareModal();
                break;
            case 1:
                $scope.newHotel = exp;
                _loadHotelModal();
                break;
            case 2:
                $scope.newTransportation = exp;
                _loadTransportationModal();
                break;
            case 3:
                $scope.newMileage = exp;
                _loadMileageModal();
                break;
            case 4:
                $scope.newMeal = exp;
                _loadMealsModal();
                break;
            case 5:
                $scope.newMisc = exp;
                _loadMiscModal();
                break;
            default:
                break;
        }
    }
    
	function _sendTrip() {
        var t = TripSvc.currentTrip;
        
        _confirmNoReceipts(t).then(function(res) {
            var reportPath = "";
            
            if (res) {
                return ReportSvc
                .runReportAsync(TripSvc.currentTrip)
                .then(function(filePath) {
                    reportPath = filePath;
                    TripSvc.currentTrip.isSubmitted = true;
                    return $ionicPopup.alert({ 
                        title: 'Trip Total', 
                        template: 'A report was generated for your trip totalling $' 
                            + t.totalExpenses() + '.  An email is being drafted with the report attached for completing your submission to the travel office.' 
                    });
                }).then(function(res) {
                    console.log('drafting email to send report');
                    return EmailSvc
                        .sendEmail(TripSvc.currentTrip, reportPath);                        
                }).then(function() {
                    $state.go('app.trips');
                });                            
            } else {
                console.log('no receipts, trip submit cancelled...');
            }

        });        
	}
    
    function _confirmNoReceipts(trip) {
        if (trip.receipts && trip.receipts.length < 1) {
            var confirmOptions = {
              title: 'No Receipts', // String. The title of the popup.
              template: 'Your trip does not appear to have any receipts.  Are you sure you want to submit this trip without receipts?'
            };
            
            return $ionicPopup.confirm( confirmOptions );

        } else {
            return true;
        }        
    }
    
    function _loadAirfareModal() {
        //
        // Load Modal Content and Animation
        //
        $ionicModal.fromTemplateUrl('app/expenses/airfare/airfareExpenseModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
          }).then(function(modal) {
//            $scope.modals[0] = modal;
                $scope.modal = modal
                modal.show();
          });		
    }
    
    function _loadHotelModal() {
        //
        // Load Modal Content and Animation
        //
        $ionicModal.fromTemplateUrl('app/expenses/hotel/hotelExpenseModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
          }).then(function(modal) {
//            $scope.modals[1] = modal;
            $scope.modal = modal
            modal.show();
          });		
    }
    
    function _loadTransportationModal() {
        //
        // Load Modal Content and Animation
        //
        $ionicModal.fromTemplateUrl('app/expenses/transportation/transportationExpenseModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
          }).then(function(modal) {
//            $scope.modals[2] = modal;
                $scope.modal = modal
                modal.show();
          });		
    }
    
    function _loadMealsModal() {
        //
        // Load Modal Content and Animation
        //
        $ionicModal.fromTemplateUrl('app/expenses/meals/mealExpenseModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
          }).then(function(modal) {
//            $scope.modals[3] = modal;
                $scope.modal = modal
                modal.show();
          });		
    }
    
    function _loadMiscModal() {
        //
        // Load Modal Content and Animation
        //
        $ionicModal.fromTemplateUrl('app/expenses/miscellaneous/miscExpenseModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
          }).then(function(modal) {
//            $scope.modals[4] = modal;
            $scope.modal = modal
            modal.show();
          });		
    }
    
    function _loadMileageModal() {
        //
        // Load Modal Content and Animation
        //
        $ionicModal.fromTemplateUrl('app/expenses/mileage/mileageExpenseModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
          }).then(function(modal) {
//            $scope.modals[4] = modal;
            $scope.modal = modal
            modal.show();
          });		
    }
});
