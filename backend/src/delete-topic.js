const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const params = {
  TableName: process.env.FAQ_TABLE,
};

module.exports.lambdaHandler = async (event) => {
  if (event.httpMethod !== "DELETE") {
    throw new Error(
      `only accepts DELETE method, you tried: ${event.httpMethod} method.`
    );
  }

  try {
    const { topic_id } = event.pathParameters;
    await dynamoDb
      .delete({
        ...params,
        Key: {
          topic_id: topic_id,
        },
        ConditionExpression: "attribute_exists(topic_id)",
      })
      .promise();

    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Headers": "*",
      },
      body: null
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
