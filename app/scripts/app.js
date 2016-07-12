'use strict';

angular
.module('listenAndWrite',['ui.router','ngResource'])
.config(["$stateProvider","$urlRouterProvider",function($stateProvider,$urlRouterProvider){
	$stateProvider
		.state('app',{
			url : '/',
			views : {
				'header' : {
					templateUrl : 'views/header.html',
					controller: 'HeaderController'
				},
				'content' : {
					templateUrl : 'views/main.html',
					controller:'HomeController'
				}
			}
		})
		.state('app.pomodoro',{
			url:'pomodoro',
			views:{
				'content@':{
					templateUrl : 'views/load_lesson.html',
					controller  : 'AddLessonController'
				}
			}
		});
	$urlRouterProvider.otherwise('/');
}]);