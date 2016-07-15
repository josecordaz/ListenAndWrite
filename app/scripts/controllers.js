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
	$scope.flVideo = '';
	$scope.flStr = '';
	$scope.progress = 0;


	$scope.uploadFile = function() {
        var fd = new FormData()
        //for (var i in $scope.files) {
        fd.append("uploadedFile",document.getElementById("video").files[0]);
        fd.append("uploadedFile",document.getElementById("str").files[0]);
        //fd.append("uploadedFile",document.getElementsByName("str"));
        //}
        var xhr = new XMLHttpRequest()
        xhr.timeout = 200000; // time in milliseconds
        xhr.upload.addEventListener("progress", uploadProgress, false)
        xhr.addEventListener("load", uploadComplete, false)
        xhr.addEventListener("error", uploadFailed, false)
        xhr.addEventListener("abort", uploadCanceled, false)
        xhr.open("POST", "http://localhost:8001/fileupload")
        $scope.progressVisible = true
        xhr.send(fd)
    }

    function uploadProgress(evt) {
        $scope.$apply(function(){
            if (evt.lengthComputable) {
                $scope.progress = Math.round(evt.loaded * 100 / evt.total)
            } else {
                $scope.progress = 'unable to compute'
            }
        })
    }

    function uploadComplete(evt) {
        /* This event is raised when the server send back a response */
        alert(evt.target.responseText)
    }

    function uploadFailed(evt) {
        alert("There was an error attempting to upload the file.")
    }

    function uploadCanceled(evt) {
        $scope.$apply(function(){
            $scope.progressVisible = false
        })
        alert("The upload has been canceled by the user or the browser dropped the connection.")
    }
}])
.controller('AdjustLesson',['$scope',function($scope){

}])
.controller('PracticeLesson',['$scope',function($scope){

}])