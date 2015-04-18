var sockjs = require('sockjs');
var _ = require('highland');
var redis = require('redis');
var redisClient = redis.createClient();
var Common = require('./../../../lib/common');
var getCurrentDate = Common.getCurrentDate;
var genKey = Common.genKey;

function createWS(httpServer) {
    var ws = sockjs.createServer();

    ws.installHandlers(httpServer, {
        prefix: '/ws'
    });

    ws.on('connection', function (conn) {
        setInterval(function () {
            conn.write(Math.random());
        }, 1000);
    })

    return ws;
}

function getRateStream() {
    function toWrap(key, cb) {
        redisClient.zrevrange(key, 0, 10, 'withscores', cb);
    }

    return _.wrapCallback(toWrap);
};

function getCompactStream(entity) {
    return getRateStream()(genKey(entity))
        .map(_)
        .flatten()
        .batch(2)
        .reduce({}, function(obj, e) {
            obj[e[0]] = e[1];
            return obj;
        })
        .map(function(e) {
            var res = {};
            res[entity] = e;
            return res;
        })
        .each(_.log)
}

getCompactStream('cities');
getCompactStream('countries');
getCompactStream('languages');
getCompactStream('clients');

module.exports = createWS;