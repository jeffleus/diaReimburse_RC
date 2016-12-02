angular.module('starter.controllers')

.controller('SettingsCtrl', function($scope, $log, SettingsSvc) {
    var self = this;
    $scope.vm = {};
    $scope.settingsSvc = SettingsSvc;
    
    $scope.$on('$ionicView.enter', function() { 
        _init(); 
    });
    $scope.$on('$ionicView.leave', function() { 
        _save(); 
    });    
	    
    function _init() {
        $log.log('SettingsCtrl_init()');
    };
    
    function _save() {
        //check the ngForm to see if settings are dirty
        var isDirty = $scope.vm.settingsForm.$dirty;
        if (isDirty) { 
            //log the save event and use the service to save changes
            $log.log('SettingsCtrl_save()');    
            SettingsSvc.pause()
                .then(function(isSaved) {
                    //reset the form to pristine after a successful save
                    $scope.vm.settingsForm.$setPristine();
                    $log.log('SettingsSvc: saved changes to settings.');
                })
                .catch(function(err) {
                    $log.error(err);
                });
        }
    }
});

