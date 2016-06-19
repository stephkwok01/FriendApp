var app = angular.module("FriendApp", ["ngRoute"]);

window.fbAsyncInit = function() {
    FB.init({ 
      appId: '660451670770089',
      status: true, 
      cookie: true, 
      xfbml: true,
      version: 'v2.4'
    });
};

(function(d, s, id){
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) {return;}
	js = d.createElement(s); js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

//config
app.config(function($routeProvider) {
	$routeProvider.when("/", {
		templateUrl: "templates/login.html"
	})
  //home page
});

//login page 
app.controller("loginCtrl", function($scope,$http,$window){
	$scope.FBlogin=function(){
		FB.login(function(response){
			if (response.authResponse){
				console.log("welcome");
				FB.api('/me',function(response){
					console.log("good to see you" + response.name);
				});
			} else {
				console.log("not authorize");
			}
		})
	};

}); //end of loginCtrl


app.controller("homeCtrl", function($scope,$http,$window){

}); //end of homeCtrl 