/**
 * Created by xingyunzhi on 16/12/1.
 */

var _ = require('underscore');
var fs = require('fs');

var data1 = require('./xlsx2json/json/weinan.json');
var data2 = require('./xlsx2json/json/xianyang.json');
var data3 = require('./xlsx2json/json/yanan.json');


function getSchools(data) {
    var bySchool = _.groupBy(data,"school");
    //所有学校
    var schools = _.keys(bySchool);
    //每个学校的人数
    var num = [];
    for(var i = 0;i<schools.length;i++){
        var byType = _.groupBy(bySchool[schools[i]],"type");
        var types = _.keys(byType);
        var byClass = _.groupBy(bySchool[schools[i]],'class');
        var classes = _.keys(byClass);
        var num1 = [];
        for(var j = 0;j<types.length;j++){
            num1.push(types[j]+'人数'+' : '+byType[types[j]].length);
        }
        var num2 = [];
        for(var k = 0;k<classes.length;k++){
            num2.push(classes[k]+'班人数'+' : '+byClass[classes[k]].length);
        }
        num11 = num1.join(' , ');
        num22 = num2.join(' , ');

        num.push(schools[i]+'总人数'+' : '+bySchool[schools[i]].length+' , '+num11 +' , '+num22);
    }
    console.log(num);

    fs.writeFile('studentsNum.json',JSON.stringify(num,null,2),function (err) {
        if(err){
            console.log(err);
        }
        console.log('it is saved!');
    });
}




getSchools(data1);



