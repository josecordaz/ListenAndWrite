'use strict';

const Hapi = require('hapi');
var fs = require('fs');
var multiparty = require('multiparty');
var path = require('path');
var srt2vtt = require('srt-to-vtt');

// Create a server with a host and port
//res.header('Access-Control-Allow-Origin', 'http://localhost:9000');
//res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, x-access-token');

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

	// Add the route
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
							fs.unlinkSync(newpath);
						});
						element = files.uploadedFile[1];
						fs.readFile(element.path,function(err,data){
							if(err) console.log(err);
							newpath = __dirname + "/lessons/"+dirName+"/"+element.originalFilename;
							fs.writeFile(newpath,data,function(err){
								if(err) console.log(err);
								fs.unlinkSync(newpath);
							});
							fs.createReadStream(__dirname + "/lessons/"+dirName+"/"+files.uploadedFile[1].originalFilename)
							.pipe(srt2vtt())
							.pipe(fs.createWriteStream(__dirname + "/lessons/"+dirName+"/"+path.basename(files.uploadedFile[1].originalFilename,'.srt')+".vtt"));
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