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

var access = '';
//login page controller
app.controller("loginCtrl", function($scope,$location,$firebaseAuth,$firebaseObject,$http,$window){


	// adding background images
	var images = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg', '11.jpg', '12.jpg',
	'13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg', '21.jpg', '22.jpg', '23.jpg', '24.jpg' ];
	var randomNumber = Math.floor(Math.random() * images.length);
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
		
		var provider = new firebase.auth.FacebookAuthProvider();
		provider.addScope('user_friends, user_location');
		auth.$signInWithPopup(provider).then(function(result) {
			console.log(result);
			var fbUser = result.user;
			// console.log(result.credential.accessToken);
			access = result.credential.accessToken;
			
			//store this in firebase added by Gabe
			var ref = firebase.database().ref().child('Friends').child(fbUser.uid);
			var user = $firebaseObject(ref);
			user.uid = fbUser.uid;
			user.name = fbUser.displayName;
			user.photo = fbUser.photoURL;
			user.token = access;
			user.$save();
			//end of Gabe code
		});
	};
}); //end of loginCtrl

//home page controller
app.controller("homeCtrl", function($scope, $http, $location, $firebaseAuth, $firebaseArray, $firebaseObject){
	//making arrays of objects in firebasef
	var friendRef = firebase.database().ref().child("Friends");

	//get accesstoken from firebase
	// $scope.friendID = {};

	//checking if user is signed in or not
	var auth = $firebaseAuth();
	auth.$onAuthStateChanged(function(firebaseUser) {

		if (firebaseUser) {
			// console.log(auth.$getAuth());
			

			$scope.firebaseUser = firebaseUser;
			// added code from Gabe --> getting the accses token from the database so that
			// you don't have to relogin in everytime you want use the site
			var ref = firebase.database().ref().child("Friends").child(firebaseUser.uid);
			var user = $firebaseObject(ref);
			user.$loaded().then(function() {
			// end of added code
				// console.log("user",user);
				var token = user.token;
				FB.api('/me', 'get', {access_token: token}, function(result){
					// console.log(result);
				})
				FB.api('/me/friends', 'get', {access_token: token},  function(response) {
	            	console.log(response);
	            	$scope.friendID1 = response.data[0].id;
	            	$scope.friendName1 = response.data[0].name;
	            	$scope.friendID2 = response.data[1].id;
	            	$scope.friendName2 = response.data[1].name;
	            	$scope.friendID3 = response.data[2].id;
	            	$scope.friendName3 = response.data[2].name;
	            	var fref = firebase.database().ref().child("Friends").child($scope.friendID1);
					var friend1 = $firebaseObject(fref); 
					var ftoken = friend1.token;      	
	            	$scope.myFriends = response.data;

	            	FB.api('/friendID1/friends', 'get', {access_token: ftoken},  function(response) {
	            	console.log(response);
	             //  $scope.myFriends = response.data;
	            });
	             //  $scope.myFriends = response.data;
	            });
	            

			});
		}
		else {
			$location.path("/");
		}
	});

	//sign out button 
	$scope.logout = function() {
		auth.$signOut();
		$location.path("/");
	}
}); //end of homeCtrl 


				





