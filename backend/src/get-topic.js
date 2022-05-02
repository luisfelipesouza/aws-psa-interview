const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const params = {
  TableName: process.env.FAQ_TABLE,
};

module.exports.lambdaHandler = async (event) => {
  if (event.httpMethod !== "GET") {
    throw new Error(
      `only accepts GET method, you tried: ${event.httpMethod} method.`
    );
  }

  try {
    const { topic_id } = event.pathParameters;
    const data = await dynamoDb
      .get({
        ...params,
        Key: { topic_id: topic_id },
      })
      .promise();

    if (!data.Item) {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Headers": "*",
        },
        body: JSON.stringify({ error: "Topic does not exist." }, null, 2),
      };
    }

    const topic = data.Item;

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({ topic }, null, 2),
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
