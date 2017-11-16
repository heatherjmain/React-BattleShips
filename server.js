// var express = require('express');
// var app = express();
//
// app.get('/', function (req, res) {
//   res.sendFile(`${__dirname}/client/build/index.html`);
// });
//
// app.use(express.static('client/build'));
//
//
// var server = app.listen(3000, function () {
//   var host = server.address().address;
//   var port = server.address().port;
//
//   console.log('Example app listening at http://%s:%s', host, port);
// });

var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.use(express.static('client/build'))

// allows cross origin resource sharing
app.use(function(req, res, next) {
  // res.header("Access-Control-Allow-Origin", "http://localhost:3000")
  res.header("Access-Control-Allow-Origin", "https://git.heroku.com/react-battleships.git")
  res.header("Access-Control-Allow-Credentials", true)
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next();
});

io.on('connection', function(socket){
  // // socket.on('guess', (map) => {
  //   console.log("client connectedd")
  //   io.sockets.emit('guess', {guess: 1})
  // });

  //this listens for a guess and then emits the guess to all clients
  socket.on("makeGuess", (guess) => {
    console.log("serving receiving makeGuess", guess)
    io.sockets.emit("confirmGuess", guess)
  })

  socket.on("guessResult", (guess) => {
    console.log("serving receiving guessResult", guess)
    io.sockets.emit("confirmGuessResult", guess)
  })

});

// var server = http.listen(3001, () => {
var server = http.listen(process.env.PORT, () => {
  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
});
