'use strict';

angular
.module('listenAndWrite',['ui.router'])
.config(["$stateProvider","$urlRouterProvider",function($stateProvider,$urlRouterProvider){
	$stateProvider
		.state('app',{
			url:'/',
			views: {
				'header':{
					templateUrl:'views/header.html'
				},
				'content':{
					templateUrl:'views/load_lesson.html'
				}
			}
		});
	$urlRouterProvider.otherwise('/');
}])