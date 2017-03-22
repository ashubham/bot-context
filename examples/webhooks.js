// An example to show use of webhooks.

var contextMap = require('bot-context');
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

var app = express(); // Set up an express webservice. You can use restify, Koa etc.

app.use(bodyParser.json());

// Incoming webhook.
app.post('/recieve', (req, res) => {
    let ctx = contextMap.getOrCreate(req.body.userId); // Assuming userId is in the json payload.
    if (!ctx.isSet()) {
        init(userId); // initialize the actions.
    }

    ctx.match(message, function (err, match, contextCb) {
        if (!err) contextCb(userId, match);
    });
});

function init(userId) {
    let ctx = contextMap.getOrCreate(userId);
    ctx.set(
        /.*/,  // The base matcher to match anything.
        (match) => doSomethingAndRespond(userId));
}

function doSomethingAndRespond(userId) {
    ctx.set(
        // Set some more context here.
    );
    outgoingWebhook(userID, "bla bla");
}

function outgoingWebhook(userId, message) {
    request.post({
        url: 'https://<webhook-endpoint-here>',
        form: {
            userId: userId,
            message: message
        }
    }, (err, resp, body) => {
        // Handle webhook err/response.
    });
}