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

//declaring access token variable --> will change for user upon login
var access = '';

//login page controller
app.controller("loginCtrl", function($scope,$location,$firebaseAuth,$firebaseObject,$http,$window){

	//setting on first login that the user location is lost
	$scope.cityLocation = "Lost";

	// adding background images and randomizing then on login page
	var images = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg', '11.jpg', '12.jpg',
	'13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg', '21.jpg', '22.jpg', '23.jpg', '24.jpg',
	'25.jpg', '26.jpg', '27.jpg', '28.jpg', '29.jpg', '30.jpg', '31.jpg', '32.jpg', '33.jpg', '34.jpg', '35.jpg', ];
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

		provider.addScope('user_friends');

		auth.$signInWithPopup(provider).then(function(result) {
			var fbUser = result.user;
			access = result.credential.accessToken;
			
			//storing user information in firebase -> by Gabe
			var ref = firebase.database().ref().child('Friends').child(fbUser.uid);
			var user = $firebaseObject(ref);
			user.uid = fbUser.uid;
			user.name = fbUser.displayName;
			user.photo = fbUser.photoURL;
			user.token = access;
			user.Location = $scope.cityLocation;
			user.$save();
			//end of Gabe code
		});
	};
}); //end of loginCtrl

//home page controller
app.controller("homeCtrl", function($scope, $http, $location, $firebaseAuth, $firebaseArray, $firebaseObject, $filter){
	//making arrays of objects in firebasef
	var friendRef = firebase.database().ref().child("Friends");

	//checking if user is signed in or not and gathering information if they are signed in
	var auth = $firebaseAuth();
	auth.$onAuthStateChanged(function(firebaseUser) {
		if (firebaseUser) {
			$scope.firebaseUser = firebaseUser;

			// added code from Gabe --> getting the accses token from the database so that
			// you don't have to relogin in everytime you want use the site
			var uref = firebase.database().ref().child("Friends").child(firebaseUser.uid);
			var user = $firebaseObject(uref);
			user.$loaded().then(function() {
			// end of added code

				//choosing city from user
				$scope.cities = ["Lost","Cape Town", "Melbourne", "Park City", "Shanghai", "Hong Kong", "New York"];
				$scope.cityLocation = user.Location;

				$scope.addLocation = function(){
					uref.child('Location').set($scope.cityLocation);
				}
				//end of choosing city from user

				//accessing facebook information on user and friends
				var token = user.token;
				FB.api('/me', 'get', {access_token: token}, function(result){
					$scope.me = result;
				})

				FB.api('/me/friends', 'get', {access_token: token},  function(response) {
					$scope.friendID = response.data[0].id;
					var fref = firebase.database().ref().child("Friends").child($scope.friendID);
					var friend1 = $firebaseObject(fref); 

					$scope.rawFBFriends = response.data;

					friendRef.on("value", function(snapshot) {

						var doubleFriend = false;
				
						$scope.firebaseFriends = snapshot.exportVal();
						$scope.facebookFriends = snapshot.exportVal();
						angular.forEach($scope.firebaseFriends, function(firefriend, index){
							// console.log(firefriend.name);
							
							angular.forEach($scope.rawFBFriends, function(facefriend, index){
								// console.log(facefriend.name);
									if(angular.equals(firefriend.name, facefriend.name)){
										doubleFriend = true;	
									}
								});
							if(angular.equals(firefriend.name, user.name)){
								delete $scope.firebaseFriends[index];
								delete $scope.facebookFriends[index];

							}
							else if(doubleFriend === true){
								delete $scope.firebaseFriends[index];

							}
							else {
								delete $scope.facebookFriends[index];
							}
						});
					});

    			});
				//end of accessing facebook information

			});
		}
		else {
			$location.path("/");
		}
	});
	//end of checking if signed in and gathering information if they are


	//sign out button 
	$scope.logout = function() {
		auth.$signOut();
		$location.path("/");
	}
	//End of sign out
});
 //end of homeCtrl 


 //potential features to add...

 // 1. adding data in each person determining who their friends are
 // ---- this will be useful when more people are added to the app 
 //and there is a need to determine whether a person is a 2nd degree
 //or 3rd degree and so on

 // 2. A proper counter for city, region, and country and degree connections

 // 3. A better location feature, possibly using facebook

 // 4. Domain Name! As well as private policy url so facebook recognizes
 //the app as a "certified app"

 // 5. Quick message feature

 // 6. Add a link to events via facebook

 // 7. CLick on div of each person...links them to their facebook

 // 8. Security...that is def not a thing right now










