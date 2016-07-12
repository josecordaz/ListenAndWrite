'use strict';

angular.module('listenAndWrite')
.controller('HeaderController',['$scope','$state',function($scope,$state){
	$scope.stateis = function(curstate){
       return $state.is(curstate);  
	}
}])
.controller('HomeController',['$scope',function($scope){

}])
.controller('AddLessonController',['$scope',function($scope){

}])