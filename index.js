var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

require('events').EventEmitter.prototype._maxListeners = 0;

var http = require('http').Server(app);

var net = require('net');

var recieveData;

var server = net.createServer(function (socket) {
  console.log(socket.address().address+"connected");

  //client로 부터 오는 data 출력
  socket.on('data',function (data) {
    console.log('recieve: '+data);
    recieveData=data;
  });

  //client와 접속이 끊겻을때
  socket.on('close',function () {
    console.log('client disconnected');
  });
  //client 가 접속 했을때
  socket.write('welcome to TCP server');

});

// 에러처리
server.on('error',function (err) {
  console.log('err'+err);
});

//port 4444로 연결 대기
server.listen(4444,function () {
  console.log('TCP listening on 4444');
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // view engine 설정

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));// 정적폴더 세팅

var tcptext="";


app.get('/',function (req,res) {
  res.render('index',{data:recieveData});

});
app.post('/input',function (req,res) {
    console.log(req.body.test);
    tcptext=req.body.test;
    res.redirect('/');
});


app.listen(3000,function () {
  console.log('server listening at port 3000');
});
