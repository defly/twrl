var Twit = require('twit');
var _ = require('highland');
var striptags = require('striptags');
var moment = require('moment');
var redis = require('redis');
var redisClient = redis.createClient();

function createWorldTweetEmitter() {
    var T = new Twit({
        'consumer_key': process.env.TWRL_TWITTER_CONSUMER_KEY,
        'consumer_secret': process.env.TWRL_TWITTER_CONSUMER_SECRET,
        'access_token': process.env.TWRL_TWITTER_ACCESS_TOKEN,
        'access_token_secret': process.env.TWRL_TWITTER_TOKEN_SECRET
    });

    var worldBoundary = [-180, -90, 180, 90];

    return T.stream('statuses/filter', {
        locations: worldBoundary
    });
}

function createTweetStream(e) {
    return _('tweet', e);
}

function getCurrentDate() {
    return moment.utc().format('DD-MM-YYYY');
}

function genKey(entity) {
    return entity + ':' + getCurrentDate();
}

function createStreamIntoStorageSet(entity) {
    function insert(e, cb) {
        redisClient.zincrby(genKey(entity), 1, e, cb);
    }
    return _.wrapCallback(insert);
}

function createStreamIntoStoragemMultipleSets(entity) {
    function insert(e, cb) {
        var key = entity + ':' + e.country + ':' + getCurrentDate();
        redisClient.zincrby(key, 1, e.city, cb);
    }
    return _.wrapCallback(insert);
}

function createStreamIntoStorageKey(entity) {
    function insert(e, cb) {
        redisClient.incr(genKey(entity), cb);
    }
    return _.wrapCallback(insert);
}

function normalizePlace(p) {
    return {
        city: p.name,
        country: p.country_code
    };
}

function consumeStream(stream) {
    return stream.flatten()
        .errors(function(e) {
            console.log(moment.utc().format() + ';' + e.toString());
        })
        .batch(1000)
        .map(() => 'batch inserted')
        .each(_.log);
}

var source = createTweetStream(createWorldTweetEmitter());

var languages = source
    .fork()
    .pluck('lang')
    .map(createStreamIntoStorageSet('languages'));

var clients = source
    .fork()
    .pluck('source')
    .map(striptags)
    .map(createStreamIntoStorageSet('clients'));

var countries = source
    .fork()
    .pluck('place')
    .pluck('country_code')
    .map(createStreamIntoStorageSet('countries'));

var places = source
    .fork()
    .pluck('place')
    .filter(p => p.place_type === 'city')
    .map(normalizePlace);

var cities = places
    .fork()
    .map(p => p.city + ':' + p.country)
    .map(createStreamIntoStorageSet('cities'));

var countryCitySet = places
    .fork()
    .map(createStreamIntoStoragemMultipleSets('countries-cities')); //

var rawTweets = source
    .fork()
    .map(createStreamIntoStorageKey('tweetsN'));

consumeStream(clients);
consumeStream(languages);
consumeStream(countries);
consumeStream(cities);
consumeStream(countryCitySet);
consumeStream(rawTweets);
