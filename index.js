var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);
// WARNING: app.listen(80) will NOT work here!

app.get('/send', function (req, res) {
    res.sendFile(__dirname + '/send.html');
});


app.get('/view', function (req, res) {
    res.sendFile(__dirname + '/view.html');
});

const connectionArray = [];

io.on('connection', function (socket) {
    // console.log(socket)
    socket.emit('who?', {});
    // socket.emit('news', { hello: 'world' });
    socket.on('name', function (data) {
        // console.log(this);
        connectionArray.push({
            name: data.name,
            socket
        });
    });

    socket.on("disconnect", function () {
        let index = connectionArray.findIndex(connect => connect.socket === socket);
        connectionArray.splice(index, 1);
    });

    socket.on("input", function ({ text }) {
        console.log(text)
        connectionArray.forEach((socketObject)=>{
            if (socketObject.name === "view"){
                socketObject.socket.emit("sendInput",{
                    text: text
                });
            }
        })
    })

});