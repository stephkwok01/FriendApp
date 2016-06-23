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

		provider.addScope('user_friends');

		auth.$signInWithPopup(provider).then(function(result) {
			var fbUser = result.user;
			access = result.credential.accessToken;
			
			//store this in firebase -> by Gabe
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

	

	

	//checking if user is signed in or not
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
				$scope.cities = ["Cape Town", "Melbourne", "Park City"];
				$scope.addLocation = function(){
					// console.log($scope.cityLocation);
					uref.child('Location').set($scope.cityLocation);
				}
				var token = user.token;
				FB.api('/me', 'get', {access_token: token}, function(result){

				})
				FB.api('/me/friends', 'get', {access_token: token},  function(response) {
					console.log(response);
					$scope.friendID = response.data[0].id;
					var fref = firebase.database().ref().child("Friends").child($scope.friendID);
					var friend1 = $firebaseObject(fref); 

					$scope.myFriends1 = response.data;

					friendRef.on("value", function(snapshot) {
						console.log(snapshot.exportVal());
						$scope.myFriends2 = snapshot.exportVal();
						angular.forEach($scope.myFriends2, function(firefriend, index){
							// console.log(firefriend.name);
							angular.forEach($scope.myFriends1, function(facefriend, index){
								// console.log(facefriend.name);
								if(angular.equals(firefriend.name, facefriend.name)){
									console.log("it works");
								 }

								
							});
						});
					});

		//angular.forEach(Venues.list, function(genre, index){
        //Only add to the availableGenres array if it doesn't already exist
        //     var exists = false;
        //     angular.forEach($scope.availableGenres, function(avGenre, index){
        //         if (avGenre == genre) {
        //             exists = true;
        //         }
        //     });
        //     if (exists === false) {
        //         $scope.availableGenres.push(genre);
        //     }
        // });



					


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






