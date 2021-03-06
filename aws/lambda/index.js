var AWS = require('aws-sdk');

AWS.config.apiVersions = {
    ec2: '2016-11-15',
    sqs: '2012-11-05',
};

var ec2 = new AWS.EC2();
var sqs = new AWS.SQS();

const StringValue = function(str) {
    return {
        DataType: "String",
        StringValue: String(str)
    };
}

const AllowedActions = ["synchronize", "opened"];

exports.handler = async function(event, context) {
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        var response = {
            "isBase64Encoded": false,
            "statusCode": 200,
            "headers": {},
            "body": ""
        };

        var json = event.body;
        if (typeof json === "string") {
            json = JSON.parse(json);
        }

        if (json["action"] === "created" || "zen" in json) {
            response["statusCode"] = 204;
            context.succeed(response);
            return;
        }

        var pull_request;
        if (!AllowedActions.includes(json["action"])) {
            response["statusCode"] = 204;
            context.succeed(response);
            return;
        }

        pull_request = json["pull_request"];

        var title = "New PR #" + pull_request["number"] +
            "\nwith base " + pull_request["base"]["ref"] +
            "\nand head " + pull_request["head"]["sha"];

        var params = {
            InstanceIds: [
                process.env["INSTANCE_ID"],
            ]
        };

        var message = {
            MessageBody: title,
            QueueUrl: process.env["QUEUE_URL"],
            MessageGroupId: "0",
            MessageAttributes: {
                "base-branch": StringValue(pull_request["base"]["ref"]),
                "base-sha": StringValue(pull_request["base"]["sha"]),
                "head-branch": StringValue(pull_request["head"]["ref"]),
                "head-sha": StringValue(pull_request["head"]["sha"]),
                "installation": StringValue(json["installation"]["id"]),
                "pr": StringValue(pull_request["number"]),
                "url": StringValue(pull_request["base"]["repo"]["url"])
            }
        };
        if ("clone_url" in pull_request["base"]["repo"]) {
            message["MessageAttributes"]["base-repo"] = StringValue(pull_request["base"]["repo"]["clone_url"]);
            message["MessageAttributes"]["head-repo"] = StringValue(pull_request["head"]["repo"]["clone_url"]);
            message["MessageAttributes"]["html-url"] = StringValue(pull_request["html_url"].replace(/\/pull\/\d+/, ''));
        }
        else {
            message["MessageAttributes"]["base-repo"] = StringValue(json["repository"]["clone_url"]);
            message["MessageAttributes"]["head-repo"] = StringValue(json["repository"]["clone_url"]);
            message["MessageAttributes"]["html-url"] = StringValue(json["repository"]["html_url"]);
        }
        response.body = JSON.stringify(message, null, 2);

        await new Promise((resolve, reject) => {
            sqs.sendMessage(message, function(err, data) {
                if (err) {
                    console.log("Error", err);
                }
                else {
                    console.log("SQS Success");
                }
                resolve();
            });
        });

        await new Promise((resolve, reject) => {
            ec2.startInstances(params, function(err, data) {
                if (err) {
                    console.log("Error", err);
                }
                else {
                    console.log("EC2 Success");
                }
                resolve();
            });
        });

        context.succeed(response);
    }
    catch (err) {
        response.statusCode = 500;
        response.body = err.message + "\n\n" + JSON.stringify(event.body);
        context.succeed(response);
    }
};
