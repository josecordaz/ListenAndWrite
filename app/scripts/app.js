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
				'content@' : {
					templateUrl : 'views/main.html',
					controller:'HomeController'
				}
			}
		})
		.state('app.add',{
			url:'add',
			views:{
				'content@':{
					templateUrl : 'views/load_lesson.html',
					controller  : 'AddLessonController'
				}
			}
		})
		.state('app.adjust',{
			url: 'adjust',
			views:{
				'content@':{
					templateUrl : 'views/adjust_lesson.html',
					controller  : 'AdjustLesson'
				}
			}
		})
		.state('app.practice',{
			url: 'practice',
			views:{
				'content@':{
					templateUrl : 'views/practice_lesson.html',
					controller: 'PracticeLesson'
				}
			}
		});
	$urlRouterProvider.otherwise('/');
}]);