var express = require('express');
var app = express();    
var path = require('path');
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});


var players=[];

io.on('connection', function (socket) {

    socket.on('nick',function(nick){
      if(players.length<2){
         socket.nick=nick;
         console.log(nick);
         players.push({ nombre: nick, vida:100, x:300,y:300 });
         socket.emit('conectando', { nombre: nick, vida:100, x:300,y:300 });
         if(players.length==2){
            socket.emit('jugador conectado', players[0]);
         }
         socket.broadcast.emit('jugador conectado',{ nombre: nick, vida:100 , x:300,y:300});
     }
    });
    

     socket.on('posicion',function(player){
      socket.broadcast.emit('posicion',player);
     });

     socket.on('bola de fuego',function(bola){
      socket.broadcast.emit('bola de fuego',bola);
     });

     socket.on('finalizar',function(nombre){
        players=[];
        socket.broadcast.emit('reiniciar',nombre);
        socket.emit('reiniciar',nombre);

     });

     socket.on('vida',function(vida){
        socket.broadcast.emit('vida',vida);

     });

     socket.on('escudo',function(escudo){
       socket.broadcast.emit('escudo',escudo);
     });
     socket.on('disconnect',function (){
       console.log(socket.nick);
       for (var i = players.length - 1; i >= 0; i--) {
         if(players[i].nombre==socket.nick){
          players.splice(i,1);
         }
       };
     });
  
});