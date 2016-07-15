'use strict';

const Hapi = require('hapi');
var fs = require('fs');
var multiparty = require('multiparty');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 8001,
	routes: { cors: true }
});

/*server.register(require('inert'),(err)=>{
	if(err){
		throw err;
	}

	// Add the route
	server.route({
	    method	: 'GET',
	    path	: '/{param*}', 
	    handler : {
	    	directory : {
	    		path : './',
	    		listing:true
	    		index:true
	    	}
	    }
	});
});*/
server.route({
	method:'GET',
	path:'/lessons',
	handler:function(req,reply){
		fs.readdir(__dirname+'/lessons/',function(err,files){
			reply(files.join(', '));
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
			maxBytes : 500000000,
			timeout : 80000
		},
		handler : function(req,reply){
			var form = new multiparty.Form();
			form.parse(req.payload, function(err, fields, files) {
				files.uploadedFile.forEach(function(element) {
					fs.readFile(element.path,function(err,data){
						if(err) console.log(err);
						var newpath = __dirname + "/lessons/"+element.originalFilename;
						fs.writeFile(newpath,data,function(err){
							if(err) console.log(err);
						})
					})
				});
				if(err) console.log(err);
				//console.log(err);
			});
			reply('Hello !');
		}
	}
})

// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});