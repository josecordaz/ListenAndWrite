'use strict';

const Hapi = require('hapi');
var fs = require('fs');
var multiparty = require('multiparty');
var path = require('path');
var srt2vtt = require('srt-to-vtt');
var readline = require('linebyline');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/listenAndWrite');

var Lesson = mongoose.model('Lesson', { _id: String, correctFrames : Array });

const server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 8001,
	routes: { cors: true }
});

server.register(require('inert'),(err)=>{
	if(err){
		throw err;
	}

	server.route({
	    method	: 'GET',
	    path	: '/lessons/{param*}', 
	    handler : {
	    	directory : {
	    		path : './lessons',
	    		listing:true//,
	    		//index:true
	    	}
	    }
	});
});

server.route({
	method:'GET',
	path:'/lessons',
	handler:function(req,reply){
		fs.readdir(__dirname+'/lessons/',function(err,files){
			reply(JSON.stringify(files));
		})
	}
});

server.route({
	method:'GET',
	path:'/lessons/{lesson}/frames/{frame}',
	handler:function(req,reply){
		Lesson.findById(req.params.lesson, function (err, lesson) {
			var res = {sub:"",time:"",frame:req.params.frame};

			if (err) next(err);
			if(req.params.frame=="-1"){
				if(!!lesson){
					req.params.frame = parseInt(lesson.correctFrames.sort().pop())+1;
					res.frame = req.params.frame;
				} else {
					req.params.frame = 1;
					res.frame = 1;
				}
			}
			var rl = readline(__dirname+'/lessons/'+req.params.lesson+'/'+req.params.lesson+'.vtt');
			var next = 0;
			

			rl.on('line', function(line, lineCount, byteCount) {
				if(next>1){
					if(line===""){
						reply(JSON.stringify(res));
					} else {
						res.sub += line+" ";
						next++;
					}
				}
				if(next==1){
					res.time = line;
					next++;
				}
				if(line == req.params.frame){
					next++;
				}
			})
			.on('error', function(e) {
				console.log(JSON.stringify(e));
			}).on('end',function(){
				if(next===0){
					res.sub = "Not found!";
					res.time = "00:00:00.000 --> 00:00:00.000";
					reply(JSON.stringify(res));
				}
			});
		});	
	}
});

server.route({
	method:'POST',
	path:'/lessons/{lesson}/frames/{frame}',
	handler:function(req,reply){
		fs.readFile(__dirname+'/lessons/'+req.params.lesson+'/'+req.params.lesson+'.vtt', 'utf-8', function(err, data){
			if (err) throw err;
			var regEx = new RegExp(req.params.frame+"\r\n([0-9]{2}:){2}[0-9]{2}.[0-9]{3}\\s-->\\s([0-9]{2}:){2}[0-9]{2}.[0-9]{3}","g");

			var strToChange = regEx.exec(data)[0];
			var newValue = data.replace(strToChange,req.params.frame+"\r\n"+req.payload.frameStart+" --> "+req.payload.frameFinish);

			fs.writeFile(__dirname+'/lessons/'+req.params.lesson+'/'+req.params.lesson+'.vtt', newValue, 'utf-8', function (err) {
				if (err) throw err;

				// Save mongodb document
				// strToChange.match(/[0-9]{1,3}/)[0]
				Lesson.findById(req.params.lesson, function (err, lesson) {
					if (err) next(err);
					if(!!lesson){
						if(lesson.correctFrames.indexOf(req.params.frame)===-1){
							lesson.correctFrames.push(req.params.frame);
							lesson.save(function (err,lesson) {
								console.log('Lesson update!');
							});
						}
					} else {
						Lesson.create({_id:req.params.lesson,correctFrames:[req.params.frame]},function(err,lesson){
							console.log('Lesson created!');
						});
					}
				});

				reply({msg:"File saved!"});
			});
		});
	}
});

server.route({
	method  : 'POST',
	path    : '/fileupload',
	config  : {
		payload : {
			output : 'stream',
			parse  : false,
			allow  : 'multipart/form-data',
			maxBytes : 900000000,
			timeout : 80000
		},
		handler : function(req,reply){
			var form = new multiparty.Form();
			form.parse(req.payload, function(err, fields, files) {
				var dirName = path.basename(files.uploadedFile[0].originalFilename,'.mp4');
				fs.mkdir(__dirname + "/lessons/"+dirName,function(err,folder){
					var element = files.uploadedFile[0];
					fs.readFile(element.path,function(err,data){
						if(err) console.log(err);
						var newpath = __dirname + "/lessons/"+dirName+"/"+element.originalFilename;
						fs.writeFile(newpath,data,function(err){
							if(err) console.log(err);
							fs.unlink(element.path,function(err){
								if (err) console.log(err);
								element = files.uploadedFile[1];
								fs.readFile(element.path,function(err,data){
									if(err) console.log(err);
									newpath = __dirname + "/lessons/"+dirName+"/"+element.originalFilename;
									fs.writeFile(newpath,data,function(err){
										if(err) console.log(err);
										fs.unlink(element.path,function(err){
											if (err) console.log(err);
											fs.createReadStream(__dirname + "/lessons/"+dirName+"/"+files.uploadedFile[1].originalFilename)
											.pipe(srt2vtt())
											.pipe(fs.createWriteStream(__dirname + "/lessons/"+dirName+"/"+path.basename(files.uploadedFile[1].originalFilename,'.srt')+".vtt"));
										});
									});
								});
							});
						});
					});					
				});
				if(err) console.log(err);
			});
			reply('Files uploaded!');
		}
	}
});

// Start the server
server.start((err) => {
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});