var http = require("http").createServer(handler);
var io = require("socket.io").listen(http);
var fs = require("fs");//variable for file system
var firmata = require("firmata");

var board = new firmata.Board("/dev/ttyACM0", function(){ // ACM Abstract Control Model for serial communication with Arduino (could be USB)
    console.log("Connecting to Arduino");
    console.log("Enabling analog Pin 0");
    board.pinMode(0, board.MODES.ANALOG); // analog pin 0
    console.log("Enabling analog Pin 1");
    board.pinMode(1, board.MODES.ANALOG); // analog pin 1
    board.pinMode(2, board.MODES.OUTPUT); // direction of DC motor
    board.pinMode(3, board.MODES.PWM); // PWM of motor i.e. speed of rotation
    board.pinMode(4, board.MODES.OUTPUT); // direction DC motor
    
});


function handler(req, res){
    fs.readFile(__dirname + "/example14.html",
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

var desiredValue = 0; // desired value var
var actualValue = 0;
var factor = 0.1;
var pwm


function controlAlgorithm () {
    pwm = factor*(desiredValue-actualValue);
    if(pwm > 255) {pwm = 255}; // to limit the value for pwm / positive
    if(pwm < -255) {pwm = -255}; // to limit the value for pwm / negative
    if (pwm > 0) {board.digitalWrite(2,1); board.digitalWrite(4,0);}; // določimo smer če je > 0
    if (pwm < 0) {board.digitalWrite(2,0); board.digitalWrite(4,1);}; // določimo smer če je < 0
    board.analogWrite(3, Math.abs(pwm));
};

function startControlAlgorithm () {
    setInterval(function() {controlAlgorithm(); }, 30); // na 30ms call
    console.log("Control algorithm started")
};

board.on("ready", function(){
    board.analogRead(0, function(value){
       desiredValue = value; // continuous read of analog pin 0
       
    });
    board.analogRead(1, function(value) {
        actualValue = value; // continuous read of pin A1
	});
	 
    io.sockets.on("connection", function(socket) {
         socket.emit("messageToClient", "Server connected, board ready.");
       setInterval(sendValues, 40, socket); // na 40ms we send message to client
        
    });// end of sockets.on connection
    
startControlAlgorithm();

});// end of board.on ready

function sendValues (socket) {
    socket.emit("clientReadValues",
   {
        "desiredValue": desiredValue,
        "actualValue": actualValue
   });
};