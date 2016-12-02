angular.module('starter.controllers')

.controller('HomeCtrl', function($scope, $rootScope, $log, $timeout, $ionicPopup, $state
                                     , $cordovaEmailComposer, ReportSvc, EmailSvc, TripSvc) {
    $scope.vm = {};
    $scope.tripSvc = TripSvc;
    $scope.addDestination = _toggleSubmitted;
    $scope.sendTrip = _sendTrip;
    $scope.gotoTrips = _gotoTrips;
    
//    $rootScope.$on('$stateChangeSuccess', function() {
    $scope.$on('$destroy', function() {
        var isDirty = $scope.vm.tripForm.$dirty;
        if (isDirty) { 
            _save().then(function(isSaved) {
                //reset the form to pristine after a successful save
                $scope.vm.tripForm.$setPristine();
            }); 
        }
    });
    
    function _save() {
        //use the trip service to save the current trip to database
        return TripSvc.saveTrip(TripSvc.currentTrip)
        .then(function(result) {
            $log.info('Trip save: ' + result);
            return true;
        }).catch(function(err) {
            $log.error(err);
            return false;
        });
    }
	
    function _toggleSubmitted() {
        TripSvc.currentTrip.isSubmitted = !TripSvc.currentTrip.isSubmitted;
    }
    
	function _sendTrip() {
		ReportSvc
			.runReportAsync(TripSvc.currentTrip)
			.then(function(filePath) {
//				console.log('new async report routine');
//				showLoading('Opening Report...');
				console.log('drafting email to send report');
//				_sendEmail(filePath);
                TripSvc.currentTrip.isSubmitted = true;
                EmailSvc
                    .sendEmail(TripSvc.currentTrip, filePath)
                    .then(function() {
                        $state.go('app.trips');
                    });
			});
	}

    function _gotoTrips() {
        $state.go('app.trips');
    };
  
    function _addDestination() {
        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="vm.destination">',
            title: 'Enter Wi-Fi Password',
            subTitle: 'Please use normal things',
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                { text: '<b>Save</b>',
                type: 'button-positive',
                onTap: function(e) {
                    if (!$scope.vm.destination) {
                    //don't allow the user to close unless he enters wifi password
                    e.preventDefault();
                } else {
                    return $scope.vm.destination;
                }}
            }]
        });

        myPopup.then(function(res) {
            console.log('Tapped!', res);
            var d = { id: TripSvc.currentTrip.destinations.length + 1, title: res };
            TripSvc.currentTrip.destinations.push(d);
        });
//        $timeout(function() {
//            myPopup.close(); //close the popup after 3 seconds for some reason
//        }, 3000);
    };
});
