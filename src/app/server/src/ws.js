var sockjs  = require('sockjs');

function createWS(httpServer) {
    var ws = sockjs.createServer();

    ws.installHandlers(httpServer, {
        prefix: '/ws'
    });
    
    ws.on('connection', function (conn) {
        // conn.on('data', function(message) {
        //     conn.write(message);
        // });
        setInterval(function () {
            conn.write(Math.random());
        }, 1000);
    })

    return ws;
}

module.exports = createWS;