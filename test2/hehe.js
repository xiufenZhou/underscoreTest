var ioredis = require('ioredis');
var redislock = require('redislock');
var async = require('async');

var redisClient;

function createRedisClient() {
    if(gameConfig.redis.cluster_mode){
        redisClient = new ioredis.Cluster(gameConfig.redis.cluster);
        console.log('use redis with cluster');
    }else{
        redisClient = new ioredis.Cluster(gameConfig.redis.single);
        console.log('use redis with single point');
    }

    redisClient.on('connect',function () {
        console.log('REDIS CONNECTED');
    });
    redisClient.on('ready',function () {
        console.log('REDIS READY');
    });
    redisClient.on('error',function () {
        console.log('REDIS CONNECTION error'+err);
        console.log('node error',err.lastNodeError);
    });
    redisClient.on('close',function () {
        console.log('REDIS CONNECTION CLOSE');
    });
    redisClient.on('reconnecting',function () {
        console.log('REDIS RECONNECTING');
    });
    redisClient.on('end',function () {
        console.log('REDIS CONNECTION END');
    });

    redislock.setDefaults({
        timeout:10000,
        retries:3,
        delay:50
    });

}

createRedisClient();

//Hash
exports.redisHSet = function (key,field,value,callback) {
    redisClient.hset(key,field,JSON.stringify(value),callback);
};

exports.redisHGet = function (key,field,callback) {
    redisClient.hget(key,field,function (err,data) {
        if(!err && !!data){
            data = JSON.parse(data);
        }
        callback(err,data);
    });
};

exports.redisHGetAll = function (key,callback) {
    redisClient.hgetall(key,function (err,data) {
        if(!err && !!data){
            for(var key in data){
                data[key] = JSON.parse(data[key]);
            }
        }
        callback(err,data);
    })
};

exports.redisHMset = function (sets,callback) {
    redisClient.hmset(sets,callback);
};

exports.redisHMGet = function (key,fields,callback) {
    redisClient.hmget(key,fields,function (err,data) {
        var array = [];
        if(!err && !!data && data.length){
            data.forEach(function (item) {
                array.push(JSON.parse(item));
            });
        }
        callback(err,array);
    });
};

exports.redisHDel = function (key,field,callback) {
    redisClient.hdel(key,field,callback);
};

exports.redisHIncrBy = function (key,field,value,callback) {
    redisClient.hincrby(key,field,value,callback);
};

exports.redisHKeys = function (key,callback) {
    redisClient.hkeys(key,callback);
};

exports.redisHLen = function (key,callback) {
    redisClient.hlen(key,callback);
};

//Sorted set

exports.redisZAdd = function (key,score,uid,callback) {
    redisClient.zadd(key,score,uid,callback);
};

//[key,field,value,field,value,,,,,,,]
exports.redisZAddSets = function (sets,callback) {
    redisClient.zadd(sets,callback);
};

exports.redisZIncrBy = function (key,field,value,callback) {
    redisClient.zincrby(key,value,field,callback);
};

exports.redisZSCORE= function (key,uid,callback) {
    redisClient.zscore(key,uid,callback);
};

exports.redisZRANGEBYSCORE = function (key,min,max,callback) {
    redisClient.zrangebyscore(key,min,max,callback);
};

//获取排行榜所有用户id 正序 需要reverse
exports.redisZRANGEBYSCOREALL = function (key,callback) {
    redisClient.zrangebyscoreall(key,'-inf','+inf',callback);
};

exports.redisZRANGEWITHSCORES = function (key,min,max,callback) {
    redisClient.zrange(key,min,max,'WITHSCORES',function (err,data) {
        var array = [];
        if(!err && !!data && data.length){
            for(var i = 0,j = 0;i < data.length; i += 2,j++){
                var obj = {
                    id  :   data[i],
                    value   :   parseInt(data[i+1]),
                    rankingSetKey   :   data.length/2 - j
                };
                array.push(array);
            }
        }
        if(array.length){
            array = array.reverse();
        }
        callback(err,array);
    });
};

exports.redisZCount = function (key,callback) {
    redisClient.zcount(key,'-inf','+inf',callback);
};

exports.redisZCard = function (key,callback) {
    redisClient.zcard(key,callback);
};

function redisZRank(key,field,callback) {
    var ranking = -1;
    var length = 0;

    async.waterfall([
        function (cb) {
            redisZCard(key,function (err,data) {
                if(!err && !!data){
                    length = data;
                }
                cb(err);
            });
        },
        function (cb) {
            if(length > 0){
                redisClient.zrank(key,field,function (err,data) {
                    if(!err){
                        ranking = length - data;
                    }
                    cb(err);
                });
            }else{
                cb();
            }
        }
    ],function (err) {
        callback(err,ranking);
    });
}

exports.redisZRank = redisZRank;




















