'use strict';

const Hapi = require('hapi');
var fs = require('fs');
var multiparty = require('multiparty');
var path = require('path');
var srt2vtt = require('srt2vtt');
var readline = require('linebyline');
var moment = require('moment');
var rimraf = require('rimraf');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/listenAndWrite');

var Lesson = mongoose.model('Lesson',
	{
		 _id: String,
		 subs : [
			 {
				 _id		: Number,
				 timeStart	: String,
				 timeFinish : String,
				 text		: String,
				 adjusted   : Boolean,
				 passed		: Boolean
			 }
		 ]
	}
);

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
	    		path 	: './lessons',
	    		listing : true
	    	}
	    }
	});
});

server.route({
	method  : 'POST',
	path    : '/lessons',
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
			// obtener los archivos del formulario
			form.parse(req.payload, function(err, fields, filesForm) {
				// Obtener el nombre de la leccion
				var dirName = path.basename(filesForm.uploadedFile[0].originalFilename,'.mp4');
				// Path de la nueva carpeta
				var newPath = __dirname + "/lessons/"+dirName; 
				// Eliminar registro de la base de datos
				Lesson.findById(dirName,(err,doc)=>{
					if(!!doc)
						doc.remove();
				});
				// Eliminar el directorio con sus archivos
				rimraf.sync(newPath);
				// Crear la nueva carpeta para esta leccion
				var folder = fs.mkdirSync(newPath);
				// Iterar los archivos temporales
				filesForm.uploadedFile.forEach(file=>{
					// Leer archivo tmp
					var tmpData = fs.readFileSync(file.path);
					// Establecar la nueva ruta completa
					var newPathFile = newPath+"/"+file.originalFilename;
					// Guardar el archivo tmp
					fs.writeFileSync(newPathFile,tmpData);
					// Borrar el archivo temporal
					fs.unlinkSync(file.path,err=>{});
					// Si es el archivo de subtitulos
					if(path.extname(file.path)==='.srt'){
						// Convertir str a vtt 
						srt2vtt(tmpData, function(err, vttData) {
							var strVtt = vttData.toString();
							var lesson = {};
							lesson._id = dirName;
							lesson.subs = strVtt.split("\n\n").reduce((pv,cv)=>{
								if(!!cv.match(/^[0-9].*/g)){
									var frame = cv.split('\n').join('&').split('&');
									var time = frame[1].split(" --> ");
									var obj = {
										_id : parseInt(frame[0],10),
										timeStart : time[0],
										timeFinish : time[1],
										text : frame[2]+(!!frame[3]?" "+frame[3]:"")+(!!frame[4]?" "+frame[4]:""),
										adjusted : false,
										passed : false
									}
									pv.push(obj);
								}
								return pv;
							},[]); 
							var newLesson = new Lesson(lesson);
							newLesson.save().then(function(err){
								if (err) throw err;
								console.log('User saved successfully!');
							});
						});	
					}
				});
			});
			reply('Files uploaded!');
		}
	}
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
	path:'/lessons/{lesson}/subs/{idSub}',
	handler:function(req,reply){
		var idSub = req.params.idSub == 0 ? 1 :req.params.idSub;
		Lesson.findById(req.params.lesson,{subs:{$elemMatch:{_id:idSub}}},function(err,results){
			reply(JSON.stringify(results));
		})
	}
});

/*server.route({
	method:'GET',
	path:'/lessons/{lesson}/practice/{numPractice}',
	handler:function(req,reply){
		Lesson.findById(req.params.lesson, function (err, lesson) {
			var res = {sub:"",time:"",practice:""};

			if (err) next(err);
			if(req.params.numPractice==0){
				if(lesson.framesPassed.length === 0){
					res.practice = 1;
				} else {
					res.practice = parseInt(lesson.framesPassed.sort(function(val1,val2){return parseInt(val1)>parseInt(val2)}).pop())+1;
				}
			} else {
				res.practice = req.params.numPractice;
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
				if(line == res.practice){
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
});*/

server.route({
	method:'PUT',
	path:'/lessons/{_id}/subs/{idSub}',
	handler:function(req,reply){
		var newSub = {};
		newSub["subs."+(req.params.idSub-1)] = req.payload;
		Lesson.findOneAndUpdate({_id:req.params._id}, newSub,function(err, doc){
			if(err){console.log(err);}

			var idSub = parseInt(req.params.idSub)+1;
			Lesson.findById(req.params._id,{subs:{$elemMatch:{_id:idSub}}},function(err,lesson){
				var sub = lesson.subs[0];
				if(!sub.adjusted){
					if(req.payload.timeFinish>sub.timeStart){
						sub.timeStart = req.payload.timeFinish;
						if(sub.timeStart>sub.timeFinish){
							// increase 3 second to the start and set it to the finish
							sub.timeFinish = moment(sub.timeStart,"HH:mm:ss.SSS").add("3","s").format("HH:mm:ss.SSS");
						}
						var newSub = {};
						newSub["subs."+(req.params.idSub)] = sub;
						Lesson.findOneAndUpdate({_id:req.params._id}, newSub,function(err, doc){
							console.log('doc updated');
						});
					}
				}
			});

			reply(doc.subs[req.params.idSub-1]);
		});
	}
});



server.route({
	method:'PUT',
	path:'/lessons/{lesson}/practice/{numPractice}',
	handler:function(req,reply){
		Lesson.findById(req.params.lesson, function (err, lesson) {
			if (err) next(err);
			if(lesson.framesPassed.indexOf(req.params.numPractice)===-1){
				lesson.framesPassed.push(req.params.numPractice);
				lesson.save(function (err,lesson) {
				});
			}
			reply(JSON.stringify({status:"ok"}));
		});
	}
});

// Start the server
server.start((err) => {
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});