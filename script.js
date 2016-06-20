var app = angular.module("FriendApp", ["ngRoute", "firebase"]);

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

//login page controller
app.controller("loginCtrl", function($scope,$location,$firebaseAuth,$http){
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
		})
	}
}); //end of loginCtrl

//home page controller
app.controller("homeCtrl", function($scope, $http, $location, $firebaseAuth, $firebaseArray){
	
	//checking if user is signed in or not
	var auth = $firebaseAuth();
	auth.$onAuthStateChanged(function(firebaseUser) {
    if (firebaseUser) {
      $scope.firebaseUser = firebaseUser;
      console.log(firebaseUser);
    } else {
      console.log(firebaseUser);
      $location.path("/");
    }
  });

	//sign out button 
	$scope.logout = function() {
    auth.$signOut();
    $location.path("/");
  }
}); //end of homeCtrl 













