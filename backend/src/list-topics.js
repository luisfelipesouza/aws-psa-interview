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
    const queryString = {
      limit: 5,
      ...event.queryStringParameters,
    };

    const { limit, next } = queryString;

    let localParams = {
      ...params,
      Limit: limit,
    };

    if (next) {
      localParams.ExclusiveStartKey = {
        topic_id: next,
      };
    }

    let data = await dynamoDb.scan(localParams).promise();

    let nextToken =
      data.LastEvaluatedKey != undefined ? data.LastEvaluatedKey.topic_id : null;

    const result = {
      items: data.Items,
      next_token: nextToken,
    };

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({ result }, null, 2),
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
