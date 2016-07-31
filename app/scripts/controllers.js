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
        xhr.open("POST", "http://localhost:8001/lessons");
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
.controller('AdjustLesson',['$scope','lessonsFactory','$interval','subtitlesFactory',function($scope,lessonsFactory,$interval,subtitlesFactory){

	$scope.lesson = {
		_id: "",
		idSub: 0,
		value: "",
		sub:null
	};

	var video = document.getElementById('video');

	lessonsFactory.query({}).$promise.then(
        function (response) {
            $scope.lessons = response.map(function(val){
            	return {value:val,_id:val};
            });
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        }
    );

	$scope.changeLesson = function(){
		$scope.lesson.videoSrc = "http://localhost:8001/lessons/"+$scope.lesson.value+"/"+$scope.lesson.value+".mp4";
		video.videoSrc = "http://localhost:8001/lessons/"+$scope.lesson.value+"/"+$scope.lesson.value+".mp4";
		$scope.lesson.numFrame = -1;
		$scope.getSub();
	}

	video.onpause = function(uno,dos,tres) {
	    $scope.buildSrc();
	    video.play();
	};

    $scope.play = function(){	
		$scope.buildSrc();
	    video.play();
	}
	$scope.stop = function(){
		$scope.lesson.videoSrc = "";
		video.src = "";
	}

	$scope.save = function(){
		$scope.lesson.subs[0].adjusted=true;
		subtitlesFactory.update({
			_id:$scope.lesson._id,
			idSub:$scope.lesson.subs[0]._id
		},$scope.lesson.subs[0],function(response){
        	$scope.stop();
        	$scope.lesson.status = "Subtitle adjusted!";
        	$interval(function(){
        		$scope.lesson.status="";
        	},2500)
        });
	}

	$scope.buildSrc = function(){
   		video.src = "http://localhost:8001/lessons/"+$scope.lesson._id+"/"+$scope.lesson._id+".mp4#t="+$scope.lesson.subs[0].timeStart+","+$scope.lesson.subs[0].timeFinish
	}

	$scope.subStart = function (q,t) {
		$scope.lesson.subs[0].timeStart = moment($scope.lesson.subs[0].timeStart,"HH:mm:ss.SSS").subtract(q,t).format("HH:mm:ss.SSS")
		$scope.buildSrc();
		video.play();
	}

	$scope.subEnd = function (q,t) {
		$scope.lesson.subs[0].timeFinish = moment($scope.lesson.subs[0].timeFinish,"HH:mm:ss.SSS").subtract(q,t).format("HH:mm:ss.SSS")
		$scope.buildSrc();
		video.play();
	}

	$scope.addStart = function (q,t) {
		$scope.lesson.subs[0].timeStart = moment($scope.lesson.subs[0].timeStart,"HH:mm:ss.SSS").add(q,t).format("HH:mm:ss.SSS")
		$scope.buildSrc();
		video.play();
	}

	$scope.addEnd = function (q,t) {
		$scope.lesson.subs[0].timeFinish = moment($scope.lesson.subs[0].timeFinish,"HH:mm:ss.SSS").add(q,t).format("HH:mm:ss.SSS")
		$scope.buildSrc();
		video.play();
	}

	$scope.getSub = function(){
    	subtitlesFactory.get($scope.lesson)
        .$promise.then(
            function (response) {
                $scope.lesson = response;
                $scope.lesson.idSub = response.subs[0]._id;
                /*var time = response.time.split(" --> ");
                $scope.lesson.sub = response.sub;
                $scope.lesson.frameStart = time[0];
                $scope.lesson.frameFinish = time[1];
                if($scope.lesson.frameStart > $scope.lesson.frameFinish){
                	$scope.lesson.frameStart = time[0];
                	$scope.lesson.frameFinish = moment(time[0],"HH:mm:ss.SSS").add("3","s").format("HH:mm:ss.SSS");
                } else if(time[1]<moment(time[0],"HH:mm:ss.SSS").add("3","s").format("HH:mm:ss.SSS")){
                	$scope.lesson.frameFinish = moment(time[0],"HH:mm:ss.SSS").add("3","s").format("HH:mm:ss.SSS");
                }
                $scope.lesson.numFrame = response.frame;*/
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );
	}

	$scope.nextFrame = function(){
		$scope.lesson.idSub++;
		$scope.getSub();
	}

	$scope.previosFrame = function(){
		if($scope.lesson.idSub !== 1){
			$scope.lesson.idSub--;
			$scope.getSub();
		}
	}

	//$scope.getSub($scope.lesson.numFrame);

}])
.controller('PracticeLesson',['$scope','lessonsFactory','practicesFactory',function($scope,lessonsFactory,practicesFactory){
	$scope.lessons = [];
	$scope.lesson = {
		value : "",
		practice:0,
		input:"",
		tmp:""
	};

	$scope.practice = null;

	var video = document.getElementById('video');

	video.onpause = function(uno,dos,tres) {
	    $scope.buildSrc();
	    video.play();
	};

	$scope.play = function(){	
		$scope.buildSrc();
	    video.play();
	}
	$scope.stop = function(){
		$scope.lesson.videoSrc = "";
		video.src = "";
	}


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
		video.videoSrc = "http://localhost:8001/lessons/"+$scope.lesson.value+"/"+$scope.lesson.value+".mp4";
		$scope.getPractice();
	}

	$scope.getPractice = function(){
    	$scope.practice = practicesFactory.get({
    		idLesson : $scope.lesson.value,
            idPractice : $scope.lesson.practice
        })
        .$promise.then(
            function (response) {
            	$scope.lesson.practice = response.practice;
            	var time = response.time.split(" --> ");
            	$scope.lesson.sub = response.sub.match(/[a-zA-Z\s']{2,}/g).join(" ").replace(/\s+/g," ").toLowerCase().trim();
            	$scope.lesson.tmp = response.sub;
            	$scope.lesson.frameStart = time[0];
                $scope.lesson.frameFinish = time[1];
                $scope.buildSrc();
                video.play();
                /*
                $scope.lesson.sub = response.sub;
                if($scope.lesson.frameStart > $scope.lesson.frameFinish){
                	lesson.numFrame$scope.lesson.frameStart = time[0];
                	$scope.lesson.frameFinish = moment(time[0],"HH:mm:ss.SSS").add("3","s").format("HH:mm:ss.SSS");
                } else if(time[1]<moment(time[0],"HH:mm:ss.SSS").add("3","s").format("HH:mm:ss.SSS")){
                	$scope.lesson.frameFinish = moment(time[0],"HH:mm:ss.SSS").add("3","s").format("HH:mm:ss.SSS");
                }
                $scope.lesson.numFrame = response.frame;*/
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );
	}

	$scope.buildSrc = function(){
		$scope.lesson.videoSrc = "http://localhost:8001/lessons/"+$scope.lesson.value+"/"+$scope.lesson.value+".mp4#t="+$scope.lesson.frameStart+","+$scope.lesson.frameFinish;
	    try
	    	{
	    		video.src = "";
	    		video.src = "http://localhost:8001/lessons/"+$scope.lesson.value+"/"+$scope.lesson.value+".mp4#t="+$scope.lesson.frameStart+","+$scope.lesson.frameFinish
	    	}
	    catch(error){};
	}

	$scope.inputPress = function(uno,dos){
		if($scope.lesson.sub===$scope.lesson.input){
			$scope.stop();
			$scope.lesson.input="";
			$scope.saveCorrect()
			alert('Well done! :D');
			$scope.nextPractice();
		} else if($scope.lesson.sub.substr(0,$scope.lesson.input.length)!==$scope.lesson.input){
			$scope.lesson.input = $scope.lesson.input.substr(0,$scope.lesson.input.length-1);
		}
	}

	$scope.nextPractice = function(){
		$scope.lesson.practice++;
		$scope.getPractice();
	}

	$scope.previousPractice = function(){
		if($scope.lesson.practice !== 1){
			$scope.lesson.practice--;
			$scope.getPractice();
		}
	}
	$scope.saveCorrect = function(){
		practicesFactory.update({
			idLesson : $scope.lesson.value,
            idPractice : $scope.lesson.practice
		},{},function(response){
			console.log(response);
		});
	}
}])