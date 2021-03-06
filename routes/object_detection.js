//this code is for student clients.
//when students phone camera detect suspicious objects while taking exam, it send the objects data to server
const express = require('express');
const bodyParser = require('body-parser');
const fs =require('fs');

const add_object_detection_mysql = require("/home/ubuntu/rest_api/Rest_API_Server/restapi/mysql_function/add_object_detection_mysql");
const Identification_mysql = require("/home/ubuntu/rest_api/Rest_API_Server/restapi/mysql_function/Identification_mysql");  //to get supervNum

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/', async function(req, res, next) {
  console.log('req body:');
  console.log(req.body);
  console.log('\n--end req body--\n');

  try { //mac is dendine as follow: 0 for phone, 1 for pc webcam, 2 for pc display
    const {num, name, tablename, mac, objects, detectTime} = req.body;
    if (num == undefined || name == undefined || tablename == undefined || mac == undefined || objects == undefined || detectTime == undefined) {
      throw new Error('user omits information');
    }

    let object_parsed = JSON.parse(objects);
    console.log('object_parsed\n', object_parsed);

    let errorJson = {};
    let errorPolling = {};

    errorJson[detectTime] = object_parsed;


    let result = await add_object_detection_mysql(num, tablename, mac, errorJson);


    if (result == 'success') {
        res.send('success');
    } else {
      throw new Error('err occur on add_object_detection_mysql');
    }

    const supervNum = (await Identification_mysql(num, tablename, mac)).supervNum;

    fs.appendFileSync(`/media/polling/object_${tablename}_${supervNum}.txt`, num+'^'+mac+'_'+JSON.stringify(object_parsed)+'\n');

  } catch (err) {
    console.log(err);
    res.send(err.message);
  }

});

module.exports = app;
