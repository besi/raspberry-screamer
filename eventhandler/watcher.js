#!/usr/bin/env node

var fs = require('fs');
var player = require('play-sound')(opts = {});
var mp3Duration = require('mp3-duration');
var async = require('async');
var md5 = require('md5');

var incomingDirectory = '/Projekt/nisse/scream-tower-raspi/incoming';
var outgoingDirectory = '/Projekt/nisse/scream-tower-raspi/outgoing';
var playedDirectory = '/Projekt/nisse/scream-tower-raspi/played'
var statFile = '/Projekt/nisse/scream-tower-raspi/stats.json'

var files = [];

waitAndScream();

fs.readdir(incomingDirectory, (err, directoryFiles) => {
	if (err) throw err;

	directoryFiles
	.filter((file)=>{
		return file.startsWith('GSM1');
	})
	.forEach((filename)=>{
		var path = incomingDirectory + '/' + filename;
		//tryToAddFile(path);
	});

	fs.watch(incomingDirectory, {
		encoding: 'utf-8',
		persistent: true
	}, (event, filename) => {
		if (!filename.startsWith('GSM1')) return;
		var path = incomingDirectory + '/' + filename;
		tryToAddFile(path);
	});

	writeStarted();
});



function tryToAddFile(path){
	fs.access(path, fs.F_OK | fs.R_OK, (err)=>{
		if (err){
			// it was deleted or we cannot read it
		}else{
			console.log('add file', path);
			files.push(path);
		}
	});
}

function waitAndScream() {
	if (files.length == 0) {
		console.log('no files. wait')
		return setTimeout(waitAndScream, 1000);
	} else {
		console.log('some files', files.length)
		screamFiles();
	}
}

function screamFiles() {

	var filename = files.pop();

	console.log('read file', filename);
	fs.readFile(filename, {encoding: 'utf-8'},(err, content) => {
		if (err) throw err;
		console.log('parse message', content);
		parseMessage(content, (err, message) => {
			if (err) throw err;

			if (message.body.toLowerCase() == 'stats'){
				sendStatsMessage(message, (err)=>{
					console.log('send stats');
					setTimeout(waitAndScream, 1000);
				});
				return;
			}

			if (message.from.toLowerCase() == 'telia'){
				sendOperatorMessage(message, (err)=>{
					console.log('send operator command');
					setTimeout(waitAndScream, 1000);
				});
				return;
			}

			console.log('parsed', message);
			console.log('play letters', message.body);

			playLetters(message.body, (err, delay) => {
				if (err) throw err;
				//TODO: remove the file from incoming and write it to played
				//TODO: respond to the sender
				console.log('write played file');
				writePlayedFile(message, (err)=>{
					if (err) throw err;
					console.log('wait until done')
					setTimeout(waitAndScream, delay);
				});
			});
		});
	});
}

function writePlayedFile(message, cb) {
	var file = Math.floor(Math.random() * 10000000000) + '.played';
	var path = playedDirectory + '/' + file;
	var data = {
		from: message.from || 'unknown',
		received: message.received || 'unknown',
		body: message.body || '',
		played: new Date().toISOString()
	};
	var string = JSON.stringify(data);
	fs.writeFile(path, string, cb);
}

function writeStarted(){
	fs.readFile(statFile, {encoding:'utf-8'}, (err, content) => {
		if (err) throw err;
		var data = JSON.parse(content);
		data['started'] = (data['started'] || 0) + 1;
		var string = JSON.stringify(data);
		fs.writeFile(statFile, string, (err)=>{
			if (err) throw err;
			console.log('write started');
		});
	});
}

function sendStatsMessage(message, cb){
	console.log('stats requested from ' + message.from);
	getStats((err, stats)=>{
		console.log('stats', stats, err);
		if (err) return cb(err);
		var path = outgoingDirectory + '/' + Math.floor(Math.random() * 10000000000) + '.stat';
		var text = '';
		text += 'From: Skriktornet\n';
		text += 'To: ' + message.from + '\n';
		text += '\n'
		text += 'messages: ' + stats.messages + '\n';
		text += 'uniquesenders: ' + stats.uniquesenders + '\n';
		text += 'lastmessage: ' + stats.lastmessage + '\n';
		text += 'started: ' + stats.started + '\n';
		fs.writeFile(path, text, (err)=>{
			cb(err);
		});
	});
}

function sendOperatorMessage(message, cb){
	console.log('operator message');
	var path = outgoingDirectory + '/' + Math.floor(Math.random() * 10000000000) + '.operator';
	var text = '';
	text += 'From: Skriktornet\n';
	text += 'To: 46707511190\n';
	text += '\n'
	text += message.body + '\n';
	fs.writeFile(path, text, (err)=>{
		cb(err);
	});
}

function getStats(cb){
	fs.readdir(playedDirectory, (err, files)=>{
		if (err) throw err;

		files = files.map((file)=>{
			return playedDirectory + '/' + file;
		});

		async.map(files, (file, done)=>{
			fs.readFile(file, (err, content)=>{
				if (err) return done(err);
				var data = JSON.parse(content);
				done(null, data);
			});
		}, (err, messages)=>{
			if (err) return cb(err);

			var numberOfMessages = messages.length;

			var uniqueSenders = messages.map((message)=>{
				return message.from
			})
			.filter( (value, index, self) => { 
				return self.indexOf(value) === index
			})
			.length;

			var lastMessageEpoch = messages.map((message)=>{
				return new Date(Date.parse(message.played)).getTime();
			}).reduce((newest, date)=>{
				return newest > date ? newest : date;
			}, 0);

			var lestMessageTimestamp = new Date(lastMessageEpoch).toISOString();

			fs.readFile(statFile, {encoding: 'utf-8'}, (err, content)=>{
				var startStats = JSON.parse(content);

				var stats = {
								messages: numberOfMessages,
								uniquesenders: uniqueSenders,
								lastmessage: lestMessageTimestamp,
								started: startStats['started']
							};
				cb(null, stats);
			});
		});
	});
}


function parseMessage(message, cb) {

	var lines = message.split('\n');
	var bodyStart = lines.indexOf('');
	var body = lines.slice(bodyStart + 1).map((l) => {
		return l.trim()
	}).join('\n');
	var params = {
		body: body
	};
	lines.slice(0, bodyStart)
		.map((line) => {
			var delimPos = line.indexOf(':');
			var key = line.substr(0, delimPos);
			var value = line.substr(delimPos + 2, line.length);
			return {
				key: key,
				value: value
			};
		})
		.reduce((obj, keyValue) => {
			obj[keyValue.key.toLowerCase()] = keyValue.value;
			return obj;
		}, params);

	cb(null, params);
}


function playLetters(letters, cb) {

	var letters = md5(letters).substr(0,6);

	getFiles(letters, (err, files) => {
		var totalDelay = files.map((file) => {
			file.duration = file.duration * 1000;
			return file;
		}).reduce((delay, file) => {
			file['delay'] = delay;
			return delay + file.duration;
		}, 0);

		async.map(files, (file, done) => {
			setTimeout(() => {
				player.play(file.file, (err) => {
					done(err, true);
				});
			}, file.delay);
		}, (err, results) => {
			console.log('done playing sounds', results, err);
			cb(err, 0);
		});

	});
}

function getFiles(letters, cb) {

	//TODO: letters can be hex str letters
	var files = letters.split('')
		.map((letter) => {
			switch (letter) {
				case 'a':
					return 'test.mp3';
				case 'b':
					return 'test2.mp3';
				case 'c':
					return 'test3.mp3';
				default:
					return 'test.mp3';
			}
		})
		.map((file) => {
			return '/Projekt/nisse/scream-tower-raspi/eventhandler/' + file;
		});

	async.map(files, (file, done) => {
		mp3Duration(file, (err, duration) => {
			done(err, {
				file: file,
				duration: duration
			});
		});
	}, cb);
}