'use strict';

angular.module('listenAndWrite')
.constant('baseURL','http://localhost:8001/')
.factory('lessonsFactory',['$resource','baseURL',function($resource,baseURL){
    return $resource(baseURL+"lessons/:id",null,{
      'update':{
        method:'PUT'
      }
    });
}])
.factory('subtitlesFactory',['$resource','baseURL',function($resource,baseURL){
    return $resource(baseURL+"lessons/:_id/subs/:idSub/",{_id:"@_Id",idSub:"@IdSub"},{
      update:{
        method:'PUT'
      }
    });
}]);