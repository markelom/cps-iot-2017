var http = require("http").createServer(handler);
var io = require("socket.io").listen(http);
var fs = require("fs");//variable for file system
var firmata = require("firmata");

var board = new firmata.Board("/dev/ttyACM0", function(){ // ACM Abstract Control Model for serial communication with Arduino (could be USB)
    console.log("Connecting to Arduino");
    console.log("Activation of Pin 8");
    board.pinMode(8, board.MODES.OUTPUT); // Configures the specified pin to behave either as an input or an output.
    console.log("Activation of Pin 13");
    board.pinMode(13, board.MODES.OUTPUT);
    console.log("Activation of Pin 9");
    board.pinMode(9, board.MODES.OUTPUT); // Configures the specified pin to behave either as an input or an output.
    console.log("Activation of Pin 10");
    board.pinMode(10, board.MODES.OUTPUT);
    
});


function handler(req, res){
    fs.readFile(__dirname + "/Assignment04.html",
    function (err, data) {
        if (err) {
            res.writeHead(500,{"Content-Type": "text/plain"});
            return res.end("Error loading HTML page.");
        }
        res.writeHead(200);
        res.end(data);
    });
    
}

http.listen(8080);// server will listen on port 8080

io.sockets.on("connection", function(socket){
  socket.on("commandToArduino", function(commandNo){
     if (commandNo == "0") {
            board.digitalWrite(13, board.LOW); // write LOW on pin 13
        }
        if (commandNo == "1") {
         board.digitalWrite(13, board.HIGH); // write LOW on pin 13
        }
        if (commandNo == "2") {
            board.digitalWrite(8, board.LOW); // write LOW on pin 8
        }
        if (commandNo == "3") {
            board.digitalWrite(8, board.HIGH); // write HIGH on pin 8
        }     
        
        if (commandNo == "4") {
            board.digitalWrite(10, board.LOW); // write LOW on pin 10
        }
        if (commandNo == "5") {
         board.digitalWrite(10, board.HIGH); // write LOW on pin 10
        }
        if (commandNo == "6") {
            board.digitalWrite(9, board.LOW); // write LOW on pin 9
        }
        if (commandNo == "7") {
            board.digitalWrite(9, board.HIGH); // write HIGH on pin 9
        } 
        
        
         if (commandNo == "8") {
            board.digitalWrite(8, board.LOW); 
             board.digitalWrite(13, board.LOW);
             board.digitalWrite(10, board.LOW);
             board.digitalWrite(9, board.LOW);
        }
        if (commandNo == "9") {
            board.digitalWrite(8, board.HIGH); 
             board.digitalWrite(13, board.HIGH);
             board.digitalWrite(10, board.HIGH);
             board.digitalWrite(9, board.HIGH);
        }  
        
        
  });
});