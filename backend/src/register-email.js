const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const params = {
  TableName: process.env.EMAIL_TABLE,
};

module.exports.lambdaHandler = async (event) => {
  if (event.httpMethod !== "POST") {
    throw new Error(
      `only accepts GET method, you tried: ${event.httpMethod} method.`
    );
  }
  try {
    const timestamp = new Date()
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");

    let data = JSON.parse(event.body);

    const { name, email, body } = data;

    const topic = {
      message_id: uuidv4(),
      name,
      email,
      body,
      created_at: timestamp,
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
      body: JSON.stringify(
        {
          error: ex.name ? ex.name : "Exception",
          message: ex.message ? ex.message : "Unknown error",
          stack: ex.stack ? ex.stack : "Unknown stack",
        },
        null,
        2
      ),
    };
  }
};
