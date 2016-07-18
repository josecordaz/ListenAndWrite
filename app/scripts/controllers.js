'use strict';

angular.module('listenAndWrite')
.controller('HeaderController',['$scope','$state',function($scope,$state){
	$scope.stateis = function(curstate){
       return $state.is(curstate);  
	}
}])
.controller('HomeController',['$scope',function($scope){

}])
.controller('AddLessonController',['$scope','$interval',function($scope,$interval){
	$scope.flVideo = '';
	$scope.flStr = '';
	$scope.progress = 0;
	$scope.showMsg = false;

	$scope.uploadComplete = function (evt) {
        /* This event is raised when the server send back a response */
        //$scope.changeMessage(true);
    }

    $scope.changeMessage = function(bool){
    	$scope.showMsg = bool;
    }

	$scope.uploadFile = function() {
		$scope.showMsg = false;
		$scope.progress = 0;
        var fd = new FormData();
        //for (var i in $scope.files) {
        fd.append("uploadedFile",document.getElementById("video").files[0]);
        fd.append("uploadedFile",document.getElementById("str").files[0]);
        //fd.append("uploadedFile",document.getElementsByName("str"));
        //}
        var xhr = new XMLHttpRequest();
        xhr.timeout = 200000; // time in milliseconds
        xhr.upload.addEventListener("progress", $scope.uploadProgress, false);
        xhr.addEventListener("load",$scope.uploadComplete, false);
        xhr.addEventListener("error", $scope.uploadFailed, false);
        xhr.addEventListener("abort", $scope.uploadCanceled, false);
        xhr.open("POST", "http://localhost:8001/fileupload");
        $scope.progressVisible = true;
        xhr.send(fd);
    }

    $scope.uploadProgress = function (evt) {
        $scope.$apply(function(){
            if (evt.lengthComputable) {
                $scope.progress = Math.round(evt.loaded * 100 / evt.total)
                if($scope.progress ===100){
                	$scope.showMsg = true;
                	$interval(function(){
                    	$scope.showMsg = false;
	                },3000);
                }
            } else {
                $scope.progress = 'unable to compute'
            }
        })
    }

    

    $scope.uploadFailed = function (evt) {
        alert("There was an error attempting to upload the file.")
    }

    $scope.uploadCanceled = function (evt) {
        $scope.$apply(function(){
            $scope.progressVisible = false
        })
        alert("The upload has been canceled by the user or the browser dropped the connection.")
    }
}])
.controller('AdjustLesson',['$scope','lessonsFactory','$interval',function($scope,lessonsFactory,$interval){

	$scope.frameStart = "00:01:09.330";
	$scope.frameFinish = "00:01:15.869";
	$scope.lesson;
	lessonsFactory.query({}).$promise.then(
        function (response) {
            $scope.lessons = response;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        }
    );
	var video = document.getElementById('video');
	video.onpause = function(uno,dos,tres) {
		console.log(uno.eventPhase);
	    video.src = "http://localhost:8001/lessons/The_Amazing_Power_of_Your_Mind_-_A_MUST_SEE/The_Amazing_Power_of_Your_Mind_-_A_MUST_SEE.mp4#t="+$scope.frameStart+","+$scope.frameFinish;
	    video.play();
	};

    $scope.play = function(){	
	    video.src = "http://localhost:8001/lessons/The_Amazing_Power_of_Your_Mind_-_A_MUST_SEE/The_Amazing_Power_of_Your_Mind_-_A_MUST_SEE.mp4#t="+$scope.frameStart+","+$scope.frameFinish;
	    video.play();
		//$interval(function(){
        //	video.pause();
        //},4830);
	}
	$scope.stop = function(){
		video.src = "";
	}

	$scope.add10ms = function(){
		$scope.frameFinish = $scope.frameFinish.split(".")[0]+"."+(parseInt($scope.frameFinish.split(".")[1],10)+10);
		console.log($scope.frameFinish);
	}
}])
.controller('PracticeLesson',['$scope',function($scope){

}])