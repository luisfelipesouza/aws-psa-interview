const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const params = {
  TableName: process.env.FAQ_TABLE,
};

module.exports.lambdaHandler = async (event) => {
  if (event.httpMethod !== "PUT") {
    throw new Error(
        `only accepts PUT method, you tried: ${event.httpMethod} method.`
      );
    }

  try {
    const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    const { topic_id } = event.pathParameters;
    let data = JSON.parse(event.body);
    const { title, content, artist } = data;

    await dynamoDb
      .update({
        ...params,
        Key: {
            topic_id: topic_id,
        },
        UpdateExpression:
          "SET title = :title, content = :content, artist = :artist," +
          "updated_at = :updated_at",
        ConditionExpression: "attribute_exists(topic_id)",
        ExpressionAttributeValues: {
          ":title": title,
          ":content": content,
          ":artist": artist,
          ":updated_at": timestamp,
        },
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
      body: JSON.stringify(
        {
          error: ex.name ? ex.name : "Exception",
          message: ex.message ? ex.message : "Unknown error",
          stack: ex.stack ? ex.stack : "Unknown stack",
        },null,2),
    };
  }
}
