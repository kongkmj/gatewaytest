var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

require('events').EventEmitter.prototype._maxListeners = 0;

var http = require('http').Server(app);
var io = require('socket.io')(http);

var net = require('net');
var recieveData;
var sendData;

var server = net.createServer(function (socket) {
  console.log(socket.address().address+"connected");



  //client로 부터 오는 data 출력
  socket.on('data',function (data) {
    recieveData=""+data;
    console.log(recieveData);
    io.emit('tcptest',recieveData);
  });

  //client와 접속이 끊겻을때
  socket.on('close',function () {
    console.log('client disconnected');
  });
  //client 가 접속 했을때
  socket.write('welcome to TCP server');


io.on('connection', function (socket2) {
      socket2.on('senddata3',function(msg){
      socket.write(msg);
    });
});

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
  res.render('index');

});
app.post('/input',function (req,res) {
    console.log(req.body.test);
    tcptext=req.body.test;
    io.emit('senddata1',tcptext);
});

io.on('connection', function (socket2) {
    //chat message 이벤트 발생
    socket2.on('senddata',function(msg){
        //public 통신
        io.emit('senddata',msg);
    });
});

http.listen(3000,function () {
  console.log('server listening at port 3000');
});
