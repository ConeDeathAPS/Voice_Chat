var speakeasy = angular.module('speakeasy', ['ngRoute', 'ngCookies', 'angular-md5']);

	speakeasy.config(function ($routeProvider) {
		$routeProvider
		.when('/', {
			templateUrl: '/static/partials/lander.html'
		})
		.when('/chat', {
			templateUrl: '/static/partials/chatter.html'
		})
		.when('/favicon.ico', {
			templateUrl: '/static/assets/imgs/favicon.ico'
		})
	})


