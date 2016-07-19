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

	/*$scope.uploadComplete = function (evt) {
        // This event is raised when the server send back a response 
        //$scope.changeMessage(true);
    }*/

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
        //xhr.addEventListener("load",$scope.uploadComplete, false);
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
                $scope.progress = 'unable to compute';
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
.controller('AdjustLesson',['$scope','lessonsFactory','$interval','framesFactory',function($scope,lessonsFactory,$interval,framesFactory){

	$scope.lesson = {
		frameStart: "00:00:00.000",
		frameFinish: "00:00:04.200",
		value: "",
		numFrame:1,
		sub:""
	};

	lessonsFactory.query({}).$promise.then(
        function (response) {
            $scope.lessons = response.map(function(val){
            	return {value:val,description:val};
            });
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        }
    );

    

	$scope.changeLesson = function(){
		$scope.getFrame();
	}

	var video = document.getElementById('video');
	video.onpause = function(uno,dos,tres) {
	    video.src = "http://localhost:8001/lessons/"+$scope.lesson.value+"/"+$scope.lesson.value+".mp4#t="+$scope.lesson.frameStart+","+$scope.lesson.frameFinish;
	    video.play();
	};

    $scope.play = function(){	
	    video.src = "http://localhost:8001/lessons/"+$scope.lesson.value+"/"+$scope.lesson.value+".mp4#t="+$scope.lesson.frameStart+","+$scope.lesson.frameFinish;
	    video.play();
	}
	$scope.stop = function(){
		video.src = "";
	}

	$scope.save = function(){
		// update time in this subtitle
	}

	$scope.sub1sStart = function(){
		$scope.lesson.frameStart = moment($scope.lesson.frameStart,"HH:mm:ss.SSS").subtract("1","s").format("HH:mm:ss.SSS");
	}

	$scope.sub100msStart = function(){
		$scope.lesson.frameStart = moment($scope.lesson.frameStart,"HH:mm:ss.SSS").subtract("100","ms").format("HH:mm:ss.SSS")
	}

	$scope.sub10msStart = function(){
		$scope.lesson.frameStart = moment($scope.lesson.frameStart,"HH:mm:ss.SSS").subtract("10","ms").format("HH:mm:ss.SSS")
	}

	$scope.sub1sEnd = function(){
		$scope.lesson.frameFinish = moment($scope.lesson.frameFinish,"HH:mm:ss.SSS").subtract("1","s").format("HH:mm:ss.SSS");
	}

	$scope.sub100msEnd = function(){
		$scope.lesson.frameFinish = moment($scope.lesson.frameFinish,"HH:mm:ss.SSS").subtract("100","ms").format("HH:mm:ss.SSS")
	}

	$scope.sub10msEnd = function(){
		$scope.lesson.frameFinish = moment($scope.lesson.frameFinish,"HH:mm:ss.SSS").subtract("10","ms").format("HH:mm:ss.SSS")
	}

	$scope.add10msEnd = function(){
		$scope.lesson.frameFinish = moment($scope.lesson.frameFinish,"HH:mm:ss.SSS").add("10","ms").format("HH:mm:ss.SSS")
	}

	$scope.add100msEnd = function(){
		$scope.lesson.frameFinish = moment($scope.lesson.frameFinish,"HH:mm:ss.SSS").add("100","ms").format("HH:mm:ss.SSS")
	}

	$scope.add1sEnd = function(){
		$scope.lesson.frameFinish = moment($scope.lesson.frameFinish,"HH:mm:ss.SSS").add("1","s").format("HH:mm:ss.SSS")
	}

	$scope.add10msStart = function(){
		$scope.lesson.frameStart = moment($scope.lesson.frameStart,"HH:mm:ss.SSS").add("10","ms").format("HH:mm:ss.SSS")
	}

	$scope.add100msStart = function(){
		$scope.lesson.frameStart = moment($scope.lesson.frameStart,"HH:mm:ss.SSS").add("100","ms").format("HH:mm:ss.SSS")
	}

	$scope.add1sStart = function(){
		$scope.lesson.frameStart = moment($scope.lesson.frameStart,"HH:mm:ss.SSS").add("1","s").format("HH:mm:ss.SSS")
	}

	$scope.getFrame = function(idFrame){
    	framesFactory.get({
    		idLesson : $scope.lesson.value,
            idFrame : $scope.lesson.numFrame
        })
        .$promise.then(
            function (response) {
                var time = response.time.split(" --> ");
                $scope.lesson.sub = response.sub;
                $scope.lesson.frameStart = time[0];
                $scope.lesson.frameFinish = time[1];
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );
	}

	$scope.nextFrame = function(){
		$scope.lesson.numFrame++
		$scope.getFrame();
	}

	$scope.getFrame($scope.lesson.numFrame);

}])
.controller('PracticeLesson',['$scope',function($scope){

}])