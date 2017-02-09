var fuckword = require('./fuckword');

var words = require('./robotsName.json');

for(var i = 0;i < words.length;i++){
    var word = words[i].prefix;
    if(word && fuckword.check(word)){
        console.log(word);
    }
}
