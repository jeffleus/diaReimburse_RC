angular.module('starter.controllers')

.controller('ReceiptCtrl', function($scope, $state, $ionicScrollDelegate, $timeout
                                    , TripSvc, ImageSvc, ReceiptSvc) {
    
    $scope.tripSvc = TripSvc;
    $scope.receiptSvc = ReceiptSvc;
    $scope.imageSvc = ImageSvc;
    $scope.gotoReceipts = _saveReceipt;	//_gotoReceipts;
    $scope.docFolder = cordova.file.documentsDirectory;
	//set the sizing for image display width
    (document.getElementById('page')).style.width = (screen.width) + "px";
    
    $scope.$on('$ionicView.beforeEnter', function() {
        //timeout addresses issue where delegate could not find elem because compile not complete
        $timeout(function() {
            $ionicScrollDelegate.$getByHandle('inner').zoomTo(6);
            $ionicScrollDelegate.$getByHandle('inner').zoomBy(0.4);
            $ionicScrollDelegate.$getByHandle('inner').zoomTo(0.5);
        }, 250);
    });

	$scope.$on('$ionicView.enter', function() {
        console.log('Enter Receipt Ctrl...');
    });

    $scope.$on('$ionicView.leave', function() { 
		console.log('BrowseCtrl: saving tripSvc data to localStorage on leave'); TripSvc.pause(); 
	});
    
    function _gotoReceipts(t) {
//        TripSvc.pause();
//        $state.go('app.single.receipts', {'playlistId':TripSvc.currentTrip.id});
        return TripSvc.currentTrip.addReceipt(ReceiptSvc.currentReceipt, ImageSvc.currentImage.imageFile)
            .then(function(imgUrl) {
                $state.go('app.single.receipts', {'playlistId':TripSvc.currentTrip.id});
            });
    }
    
    $scope.zoomLevel = function() {
        var view = $ionicScrollDelegate.$getByHandle('inner').getScrollView();
        return view.__zoomLevel;
    }
    $scope.zoomIn = function() {
        $ionicScrollDelegate.$getByHandle('inner').zoomBy(2);
    };
    
    $scope.zoomOut = function() {
        $ionicScrollDelegate.$getByHandle('inner').zoomBy(0.5);
    };
    
    function _saveReceipt() {
        if (ReceiptSvc.currentReceipt.isNewReceipt) {
            return TripSvc.currentTrip.addReceipt(ReceiptSvc.currentReceipt, ImageSvc.currentImage.imageFile)
                .then(function(imgUrl) {
                    $state.go('app.single.receipts', {'playlistId':TripSvc.currentTrip.id});
                });            
        } else {
            return TripSvc.saveTrip(TripSvc.currentTrip).then(function(){
                ReceiptSvc.currentReceipt.isNewReceipt = false;
            })
        }

//		TripSvc.currentTrip.addReceipt(ReceiptSvc.currentReceipt)
//			.then(function() {
//				$state.go('app.single.receipts', {'playlistId':TripSvc.currentTrip.id});
//			});
    }
    
    function _cancelReceipt() {
    }
    
});
