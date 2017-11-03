var http = require("http").createServer(handler);
var io = require("socket.io").listen(http);
var fs = require("fs");//variable for file system
var firmata = require("firmata");

var board = new firmata.Board("/dev/ttyACM0", function(){ // ACM Abstract Control Model for serial communication with Arduino (could be USB)
    console.log("Connecting to Arduino");
    console.log("Enabling Push Button on pin 2");
    board.pinMode(2, board.MODES.INPUT);
    console.log("Activation of Pin 13");
    board.pinMode(13, board.MODES.OUTPUT); // Configures the specified pin to behave either as an input or an output.
});



function handler(req, res){
    fs.readFile(__dirname + "/example07.html",
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
    board.digitalRead(2, function(value) {
        if (value == 0) {
            console.log("LED OFF");
            board.digitalWrite(13, board.LOW);
            console.log("Value = 0");
            socket.emit("messageToClient", "Value = 0");
        }
        if (value == 1) {
            console.log("LED ON");
            board.digitalWrite(13, board.HIGH);
            console.log("Value = 1");
            socket.emit("messageToClient", "Value = 1");
        }
        
    });
});