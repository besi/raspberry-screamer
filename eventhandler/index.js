#!/usr/bin/env node

var args = require('args');
var fs = require('fs');
var player = require('play-sound')(opts = {});
var mp3Duration = require('mp3-duration');
var async = require('async');

args
  .command('SENT', 'handle a SENT message', (name, sub, options) => {
    var mess = 'SENT' + JSON.stringify(sub);
    console.log(mess);
    fs.writeFileSync('/Projekt/nisse/scream-tower-raspi/loggy.log', mess);
  })
  .command('RECEIVED', 'handle a RECEIVED message', (name, sub, options) => {
    var mess = 'RECEIVED' + JSON.stringify(sub);
    console.log(mess);

    fs.readFile(sub[0], 'utf-8', (err, data) => {
      console.log(data, err);
      parseMessage(data);
    });
  })
  .command('FAILED', 'handle a FAILED message', (name, sub, options) => {
    var mess = 'FAILED' + JSON.stringify(sub);
    console.log(mess);
    fs.writeFileSync('/Projekt/nisse/scream-tower-raspi/loggy.log', mess);
  })
  .command('REPORT', 'handle a REPORT', (name, sub, options) => {
    var mess = 'REPORT' + JSON.stringify(sub);
    console.log(mess);
    fs.writeFileSync('/Projekt/nisse/scream-tower-raspi/loggy.log', mess);
  })
  .command('CALL', 'handle a CALL', (name, sub, options) => {
    var mess = 'CALL' + JSON.stringify(sub);
    console.log(mess);
    fs.writeFileSync('/Projekt/nisse/scream-tower-raspi/loggy.log', mess);
  });

var flags = args.parse(process.argv);

function parseMessage(message, cb){

  var lines = message.split('\n');
  var bodyStart = lines.indexOf('');
  var body = lines.slice(bodyStart+1).map((l)=>{return l.trim()}).join('\n');
  var params = {body: body};
  lines.slice(0, bodyStart)
                    .map((line)=>{
                      var delimPos = line.indexOf(':');
                      var key = line.substr(0, delimPos);
                      var value = line.substr(delimPos + 2, line.length);
                      return {key: key, value: value};
                    })
                    .reduce((obj, keyValue)=>{
                      obj[keyValue.key.toLowerCase()] = keyValue.value;
                      return obj;
                    }, params);

  console.log('message', params);

}


function playLetters(letters, cb){
  getFiles(letters, (err, files) => {
    files.map((file) => {
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
      console.log('done starting sounds', results, err);
      cb(err);
    });

  });
}

function getFiles(letters, cb) {

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

