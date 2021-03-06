const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const params = {
  TableName: process.env.FAQ_TABLE,
};

module.exports.lambdaHandler = async (event) => {
  if (event.httpMethod !== "POST") {
    throw new Error(
      `only accepts POST method, you tried: ${event.httpMethod} method.`
    );
  }

  try {
    const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    const user_id = event.requestContext.authorizer.claims["cognito:username"];

    let data = JSON.parse(event.body);

    const { title, content, artist } = data;

    const topic = {
      user_id: user_id,
      topic_id: uuidv4(),
      title,
      content,
      artist,
      created_at: timestamp,
      updated_at: timestamp,
    };

    await dynamoDb
      .put({
        ...params,
        Item: topic,
      })
      .promise();

    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Headers": "*",
      },
      body: null,
    };
  } catch (ex) {
    console.error("Error", ex);
    return {
      statusCode: ex.statusCode ? ex.statusCode : 500,
      body: JSON.stringify({
        error: ex.name ? ex.name : "Exception",
        message: ex.message ? ex.message : "Unknown error",
        stack: ex.stack ? ex.stack : "Unknown stack",
      }, null, 2),
    };
  }
};
