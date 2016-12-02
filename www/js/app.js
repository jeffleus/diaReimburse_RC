// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'starter.services', 'starter.controllers'])

.run(function($ionicPlatform, SettingsSvc, TripSvc) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }
        SettingsSvc.resume();
        TripSvc.resume();        
    });
    //handle Cordova resume (enter foreground) and pause (enter background events)
    $ionicPlatform.on('resume', function(event) {
//        console.log('RESUME: ' + moment().format('HH:mm:ss'))
//        var settings = JSON.parse(localStorage['settings']);
//        console.log(settings.lastSaved);
        SettingsSvc.resume();
        TripSvc.resume();
    });

    $ionicPlatform.on('pause', function(event) {
        //Do something here on entering background
        SettingsSvc.pause();
        TripSvc.pause();
//        localStorage['settings'] = JSON.stringify(SettingsSvc);
        //console.log('PAUSE');
    });
})

.constant('ServiceRoot', function() { return 'http://reimburse.athletics.ucla.edu/'; })

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.settings', {
    url: "/settings",
    views: {
      'menuContent': {
        templateUrl: "app/settings/settings.html",
        controller: "SettingsCtrl"
      }
    }
  })

  .state('app.browse', {
    url: "/browse",
    views: {
      'menuContent': {
        templateUrl: "app/receipts/receiptView.html",
        controller: "ReceiptCtrl"
      }
    }
  })

    .state('app.trips', {
      url: "/trips",
      views: {
        'menuContent': {
          templateUrl: "templates/trips.html",
          controller: 'TripsCtrl'
        }
      }
    })
// 
// PROSPECT - routes for the abstract, detail, transcripts, tests, and contacts
// 
    // Abstract for Prospect Base
    .state('app.single', {
      url: "/trips/:tripId",
	  data: { isAuthRequired: true }, 
      views: {
        'menuContent' :{
			abstract: true,
            templateUrl: "templates/trip.html",
            controller: 'TripCtrl'
        }
      }
    })
	// Tab:= Trip Home
		.state('app.single.home', {
		  url: '/home',
		  data: { isAuthRequired: false }, 
		  views: {
			'tab-home': {
			  templateUrl: 'app/home/tab-home.html',
              controller: 'HomeCtrl'
			}
		  }
		})
	// Tab:= Prospect Detail
		.state('app.single.dates', {
		  url: '/dates',
		  data: { isAuthRequired: false }, 
		  views: {
			'tab-dates': {
			  templateUrl: 'app/dates/tab-dates.html',
			  controller: 'DatesCtrl'
			}
		  }
		})
	// Tab:= Prospect Detail
		.state('app.single.expenses', {
		  url: '/expenses',
		  data: { isAuthRequired: false }, 
		  views: {
			'tab-expenses': {
			  templateUrl: 'app/expenses/tab-expenses.html',
			  controller: 'ExpenseCtrl'
			}
		  }
		})
	// Tab:= Prospect Detail
		.state('app.single.receipts', {
		  url: '/receipts',
		  data: { isAuthRequired: false }, 
		  views: {
			'tab-receipts': {
			  templateUrl: 'app/receipts/tab-receipts.html',
			  controller: 'ReceiptsCtrl'
			}
		  }
		})
	// Tab:= Prospect Detail
		.state('app.single.notes', {
		  url: '/notes',
		  data: { isAuthRequired: false }, 
		  views: {
			'tab-notes': {
			  templateUrl: 'app/notes/tab-notes.html',
			  controller: 'NotesCtrl'
			}
		  }
		})
  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/trips');
})
;
