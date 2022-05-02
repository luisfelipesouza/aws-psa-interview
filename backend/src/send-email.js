const AWS = require("aws-sdk");
const SES = new AWS.SES();

const FROM_EMAIL = process.env.FROM_EMAIL;
const TO_EMAIL = process.env.TO_EMAIL;

module.exports.lambdaHandler = async (event) => {
  try {
    const dynamodb = event.Records[0].dynamodb;

    const messageData = {
      case_id: dynamodb.NewImage.message_id.S,
      name: dynamodb.NewImage.name.S,
      email: dynamodb.NewImage.email.S,
      body: dynamodb.NewImage.body.S,
    };

    const emailParams = {
      Source: FROM_EMAIL,
      ReplyToAddresses: ["noreply@email.com"],
      Destination: {
        ToAddresses: [TO_EMAIL],
      },
      Message: {
        Body: {
          Text: {
            Charset: "UTF-8",
            Data: `Case Id: ${messageData.case_id}\nMessage: ${messageData.body}\nName: ${messageData.name}\nEmail: ${messageData.email}\n`,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: `Support Request from ${messageData.email}`,
        },
      },
    };

    return await SES.sendEmail(emailParams).promise();
  } catch (ex) {
    return console.error("Error", ex);
  }
};
