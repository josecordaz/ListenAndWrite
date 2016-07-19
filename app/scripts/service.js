'use strict';

angular.module('listenAndWrite')
.constant('baseURL','http://localhost:8001/')
.factory('lessonsFactory',['$resource','baseURL',function($resource,baseURL){
    return $resource(baseURL+"lessons/:id",{
      'update':{
        method:'PUT'
      }
    });
}])
.factory('framesFactory',['$resource','baseURL',function($resource,baseURL){
    return $resource(baseURL+"lessons/:idLesson/frames/:idFrame/",{idLesson:"@IdLesson",idFrame:"@IdFrame"},{
      'update':{
        method:'PUT'
      }
    });
}]);