'use strict';

const Hapi = require('hapi');
var fs = require('fs');
var multiparty = require('multiparty');
var path = require('path');
var srt2vtt = require('srt2vtt');
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
								console.log('Lesson saved successfully!');
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
		var cascade = req.query.cascade;
		var query= {};
		if(cascade==="practice"){
			if(req.params.idSub == 0){
				query = {subs:{$elemMatch:{"passed":false}}};
			} else {
				query = {subs:{$elemMatch:{_id:req.params.idSub}}};
			}
		} else {
			if(req.params.idSub == 0){
				query = {subs:{$elemMatch:{"adjusted":false}}};
			} else {
				query = {subs:{$elemMatch:{_id:req.params.idSub}}};
			}
		}
		
		Lesson.findById(req.params.lesson,query,function(err,results){
			reply(JSON.stringify(results));
		})
	}
});

server.route({
	method:'PUT',
	path:'/lessons/{_id}/subs/{idSub}',
	handler:function(req,reply){
		var cascade = req.payload.cascade;
		
		var newSub = {};
		newSub["subs."+(req.params.idSub-1)] = req.payload;

		Lesson.findOneAndUpdate({_id:req.params._id}, newSub,function(err, doc){
			if(err){console.log(err);}
			if(cascade !== "practice"){
				var idSub = parseInt(req.params.idSub)+1;
				Lesson.findById(req.params._id,{subs:{$elemMatch:{_id:idSub}}},function(err,lesson){
					var sub = lesson.subs[0];
					if(!sub.adjusted){
						if(req.payload.timeFinish > sub.timeStart){
							sub.timeStart = req.payload.timeFinish;
							if(sub.timeStart > sub.timeFinish){
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
			}
			reply(doc.subs[req.params.idSub-1]);
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