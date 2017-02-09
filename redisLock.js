/**
 * Created by xingyunzhi on 16/12/16.
 */

var client = require('redis').createClient();
var lock   = require('redislock').createLock(client, {
    timeout: 20000,
    retries: 3,
    delay: 100
});

lock.acquire('app:feature:lock', function(err) {
    console.log(err);
});
lock.acquire('app:feature:lock', function(err) {
    console.log(err);

    lock.release(function(err) {
        console.log(err);
    });
});



