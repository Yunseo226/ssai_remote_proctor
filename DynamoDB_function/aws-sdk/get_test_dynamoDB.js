const AWS = require('aws-sdk');
const {KEY, SECRET} = require('/home/ubuntu/rest_api/Rest_API_Server/restapi/config/aws_config');

AWS.config.update({
  region: 'us-east-2',
  endpoint: 'http://dynamodb.us-east-2.amazonaws.com',
  accessKeyId: KEY,
  secretAccessKey: SECRET
});

const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

async function getData(num, lecAndDate) {
  try {
    const params = {
      TableName: "video_data",
      Key: {
          "Student Number": num,
          "Lecture": lecAndDate,
      }
    };

    let result = await docClient.get(params).promise();

    if (result instanceof Error) {
      throw result;
    }

    return result.Item;
  } catch(err) {
    console.log('get_test_dynamoDB.js\n'+err);
    return err;
  }
};

// (async function() {
//   let temp = await getData('2021-11111', 'chemistry1_20210213');
//   console.log(temp);
// })();

module.exports = getData;
