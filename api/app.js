var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const http = require("http");


var index = require('./routes/index');
var users = require('./routes/users');

var app = require('express')();
var server = http.createServer(app);
var io = require('socket.io')(server);

var clients = [];

var currentCards = [];
var answers = ['Card nb1', 'Card nb 2'];
io.on('connection', function(client) {
  client.on('showCard', ({text}) => showCard({client, text}));
  client.on('requestCards', ({numberOfCards}) => requestCards({client, numberOfCards}));
  client.on('setUserName', (name) => setUserName({client, name}));
  client.on('getListClients', listClients);
  client.on('sendMessage', (text) => sendMessage({client, text}));
  client.on('getListClients', listClients);
  client.on('disconnect', () => disconnect(client));
  randomSpaceX();
});

let listClients = function() {
  let currentClients = [];
  for(let i = 0; i < clients.length; i++) {
    currentClients.push(clients[i].id);
  }
  for(let i = 0; i < clients.length; i++) {
    clients[i].emit('listClients', currentClients);
  }
};
let sendMessage = function({client, text}) {
  let clientName = client.id;
  for(let i = 0; i < clients.length; i++) {
    console.log(text);
    clients[i].emit('receiveMessage', {clientName, text});
  }
};
let setUserName = function({client, name}) {
  client.id = name;
  clients.push(client);
  clientConnected(client.id);
};

let clientDisconnected = function(client) {
  let str = 'Client' + client.id + 'disconnected';
  for(let i = 0; i < clients.length; i++) {
    clients[i].emit('clientDisconnected', str);
  }
};

let randomSpaceX = function() {
  let str = 'http://api.giphy.com/v1/gifs/search?api_key=yv39Q2Z7J1RjwW1l0SYcFPPZm41gcKDL&q=spacex';
  let data = post(str);
  console.log(data);
};

let post = function(url) {
  http.get(url, res => {
    res.setEncoding("utf8");
    let body = "";
    res.on("data", data => {
      body += data;
    });
    res.on("end", () => {
      return JSON.parse(body);
    });
  })
};

let clientConnected = function(clientName) {
  let str = 'Client' + clientName + 'connected';

  for(let i = 0; i < clients.length; i++) {
    clients[i].emit('clientConnected', str);
  }
  listClients();
};
let requestCards = function({client, numberOfCards}) {
  let cards = [];
  for(let i = 0; i < numberOfCards; i++) {
    cards.push(answers[Math.floor(Math.random() * answers.length)]);
  }
  client.emit('cardRequest', {cards})
};
let disconnect = function(client) {
  clientDisconnected(client);
  var i = clients.indexOf(client);
  clients.splice(i, 1);
  listClients();
};
let showCard = function({text}) {
  currentCards.push({text, id: client.id});
  if(currentCards.length === clients.length - 1) {
    for(let i = 0; i < clients.length; i++) {
      clients[i].emit('cardsShow', {currentCards});
    }
    currentCards = [];
  }
}


server.listen(3000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
