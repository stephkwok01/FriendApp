var app = angular.module("FriendApp", ["ngRoute", "firebase"]);


//attempt 2 at this bullshit
// app.factory('facebookService', function($q) {
// 	return {
// 		getMyLastName: function() {
// 			var deferred = $q.defer();
// 			FB.api('/me', {
// 				fields: 'last_name'
// 			}, function(response) {
// 				if (!response || response.error) {
// 					console.log("where am i")
// 					deferred.reject('Error occured');
// 				} else {
// 					deferred.resolve(response);
// 				}
// 			});
// 			return deferred.promise;
// 		}
// 	}
// });

//end of this shitty attmept

//config
app.config(function($routeProvider) {
	$routeProvider.when("/", {
		templateUrl: "templates/login.html"
	})
  //home page
  $routeProvider.when("/home",{
  	templateUrl: "templates/home.html"
  })
}); //end of config

//attempt 2 at this bullshit
// app.factory('facebookService', function($q) {
// 	return {
// 		getMyLastName: function() {
// 			var deferred = $q.defer();
// 			FB.api('/me', {
// 				fields: 'last_name'
// 			}, function(response) {
// 				if (!response || response.error) {
// 					console.log("where am i")
// 					deferred.reject('Error occured');
// 				} else {
// 					deferred.resolve(response);
// 				}
// 			});
// 			return deferred.promise;
// 		}
// 	}
// });

//end of this shitty attmept




//login page controller
app.controller("loginCtrl", function($scope,$location,$firebaseAuth,$http){

	var images = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg', '11.jpg', '12.jpg',
	'13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg', '21.jpg', '22.jpg', '23.jpg', '24.jpg' ];
	var randomNumber = Math.floor(Math.random() * images.length);
	console.log(randomNumber);
	$scope.backgroundImage = {
		'background-image' :'url(./Images/'+ randomNumber + '.jpg)',
	}
	//checking if user is signed in or not
	var auth = $firebaseAuth();
	auth.$onAuthStateChanged(function(firebaseUser){
		if (firebaseUser){
			$location.path("/home");
		}
	});

	//Sign into facebook
	$scope.FBlogin = function() {
		auth.$signInWithPopup("facebook").catch(function(error){
			console.log("Error");
			// $scope.login = function() {
   //    // From now on you can use the Facebook service just as Facebook api says
   //    Facebook.login(function(response) {
   //      console.log(response);
    //   });
    // };
})
	}

	// $scope.login = function() {
 //      // From now on you can use the Facebook service just as Facebook api says
 //      Facebook.login(function(response) {
 //        console.log(response);
 //      });
 //    };


}); //end of loginCtrl

//home page controller
app.controller("homeCtrl", function($scope, $http, $location, $firebaseAuth, $firebaseArray){
	
	//checking if user is signed in or not
	var auth = $firebaseAuth();
	auth.$onAuthStateChanged(function(firebaseUser) {
		if (firebaseUser) {
			$scope.firebaseUser = firebaseUser;
			console.log(firebaseUser);

			// console.log(facebookService);
			//plz bull shit work
			// $scope.getMyLastName = function() {
			// 	console.log(facebookService);
			// 	facebookService.getMyLastName() 
			// 	.then(function(response) {
			// 		console.log(response.last_name);
			// 	}
			// 	);
			// };
	//fuuuuccck
} else {
	console.log(firebaseUser);
	$location.path("/");
}
});

	//plz bull shit work
	// $scope.getMyLastName = function() {
	// 	console.log(facebookService.getMyLastName() );
	// 	facebookService.getMyLastName() 
	// 	.then(function(response) {
	// 		console.log(response.last_name);
	// 	}
	// 	);
	// };
	//fuuuuccck
	$scope.loadFriends = function() {

          FB.api('/me/friends', function(response) {
            $scope.$apply(function() {
              $scope.myFriends = response.data;
              console.log($scope.myFriends);
            });

          });
        };


	//sign out button 
	$scope.logout = function() {
		auth.$signOut();
		$location.path("/");
	}
}); //end of homeCtrl 













