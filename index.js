'use strict'
const express = require('express');

const DB = require('mongoose');
DB.Promise = global.Promise;
const Schema = DB.Schema;
// console.log(DB);
const single = require('./messages.js');

const arrMsg = require('./msgs.js');

const messagesSchema = {
	title: String,
	body: String
}
const DBModel = DB.model('Messages', new Schema(messagesSchema));
let temp = ['its', 'really', 'our', 'temp', 'from', 'express server'];

DB.connect('mongodb://xeontem:slipknot@ds046067.mlab.com:46067/lambda-1', { useMongoClient: true });
DB.connection.on('error', function(err) {
	console.log(err);
});

DB.connection.on('connected', function() {
	console.log('connected!');
	DBModel.find({}, function(err, docs) {
		temp = docs.map(doc => doc.toObject())
	});
});


//server
const server = express();
// server.use(bodyParser.json());
// server.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//   extended: true
// }));
server.post('*', function(req, res, next) {
	console.log('--------------------------------------------------------------');
	console.log('request from: ' + req.connection.remoteAddress);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


server.set('domain', '10.6.159.97');

server.get('/messages', function(req, res) {
	console.log('all messages requested');
	DBModel.find({}, function(err, docs) {
		// temp = docs.map(doc => doc.toObject())
		res.send(docs.map(doc => doc.toObject()));
	})
});

server.get('/messages/:id', function(req, res) {
	const id = req.params.id;
	console.log(id);
	
	DBModel.findById(id)
		.then(doc => {
			if(!doc) return res.send({}).end();
			return res.send(doc).end();
		})
});

server.get('/pushmsg', function(req, res) {
	DBModel.collection.insertOne(single, function(err, doc) {
		console.log(err);
		console.log(doc);
		res.send('insert one done!').end();
	})
})

server.get('/pushmany', function(req, res) {
	DBModel.collection.insertMany(arrMsg, function(err, doc) {
		console.log(err);
		console.log(doc);
		res.send('inserted many done!').end();
	})
})

server.post('/sad', function(req, res) {
	console.log('post req. body: ', req.body);
	res.send('done');
});

server.listen(process.env.PORT || 4444);