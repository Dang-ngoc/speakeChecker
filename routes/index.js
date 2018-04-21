var express = require('express');
var router = express.Router();

var natural = require('natural');
var tokenizer = new natural.WordTokenizer();

/* GET home page. */
router.get('/', function(req, res, next) {
  let words = ['mom', 'dad', 'balance', 'encourage', 'huge', 'purpose', 'release'];

  res.io.on('connection', function(socket) {
    console.log('Client connected...');
    socket.on('speaker_input', function(data) {
      socket.emit('compare_return', natural.JaroWinklerDistance(data.origin_word, data.speaker_word));
    });
  });

  res.render('index', {
    title: 'Thien Dang',
    words: words
  });
});
// Speak bot
var apiai = require('apiai');
var uuidv1 = require('uuid/v1');
router.get('/chat', function(req, res, next) {
  let mod = apiai("dc302ae701c7483fb791796011393aec");
  let session = uuidv1();

  res.io.on('connection', function(socket) {
    console.log('Client connected...');
    socket.on('user_speak', function(data) {
      let request = mod.textRequest(data, {
        sessionId: session
      });

      request.on('response', (response) => {
        let aiText = response.result.fulfillment.speech;
        console.log('Bot reply: ' + aiText);
        socket.emit('bot_speak', aiText);
      });

      request.on('error', (error) => {
        console.log(error);
      });

      request.end();
    });
  });

  res.render('chat', {
    title: 'Chat bot'
  });
});
var request = require('http');
router.get('/vision', function(req, res, next) {
 
  res.render('vision', {
    title: 'Vision'
  });
});

module.exports = router;
