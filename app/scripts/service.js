'use strict';

angular.module('listenAndWrite')
.factory('goalsFactory',['$resource','baseURL',function($resource,baseURL){
    return $resource(baseURL+"lessons/:id",{
      'update':{
        method:'PUT'
      }
    });
}]);