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
	// adding background images
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
		})
	};
}); //end of loginCtrl

//home page controller
app.controller("homeCtrl", function($scope, $http, $location, $firebaseAuth, $firebaseArray){

	//checking if user is signed in or not
	var auth = $firebaseAuth();
	auth.$onAuthStateChanged(function(firebaseUser) {
		if (firebaseUser) {
			$scope.firebaseUser = firebaseUser;
			console.log($scope.firebaseUser);
		}
		else {
			$location.path("/");
		}
	});

	//making arrays of objects in firebase
	var friendRef = firebase.database().ref().child("friends");

	// var friendObj = {
	// 	displayName : $scope.firebaseUser.displayName,
	// 	uid : $scope.firebaseUser.uid,
	// 	photo : $scope.firebaseUser.photoURL,
	// };
	// 	friendRef.push(friendObj);

	//sign out button 
	$scope.logout = function() {
		auth.$signOut();
		$location.path("/");
	}
}); //end of homeCtrl 





			// friendRef.once("value", function(snapshot){
			// 	snapshot.forEach(function(childSnapshot){
			// 		if(childSnapshot.val().uid === $scope.firebaseUser.uid) {
			// 			count ++;
			// 			console.log(count);
			// 		}
			// 		if (count === 0) {
					
			// 	} 
			// 	});
			// });
				





