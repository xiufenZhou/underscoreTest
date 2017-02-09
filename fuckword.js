/**
 * Created by xingyunzhi on 16/12/1.
 */

var fs = require('fs');
var async = require('async');

var FuckWord = function () {
    this.regex = null;
    this.init();
};

FuckWord.prototype.init = function () {
    var self = this;
    var fuckwords = '';

    async.waterfall([
        function (cb) {//获取屏蔽词
            fuckwords = fs.readFileSync(__dirname+'/fuckword.txt','utf8');
            cb();
        },
        function (cb) {
            fuckwords = fuckwords.split('、');

            var regexMetachars = /[(){[*+?.\\^$|]/g;

            for(var i=0;i<fuckwords.length;i++){
                fuckwords[i] = fuckwords[i].replace(regexMetachars,'\\$&');
            }
            var regex = new RegExp("(?:" + fuckwords.join('|') + ')','gi');
            self.regex = regex;
            cb();
        }
    ],function () {

    });
};

FuckWord.prototype.check = function (word) {
    var self = this;
    if(!self.regex){
        throw new Error('no regexp');
    }
    var result = word.match(self.regex) || [];
    if(result.length){
        result = result.filter(function (item) {
            return !!item;
        });
    }
    return result.length;
};

module.exports = new FuckWord();
