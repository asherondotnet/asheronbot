'use strict';

const fs = require('fs');
const Clapp = require('./modules/clapp-discord');
const cfg = require('../config.js');
const pkg = require('../package.json');
const Discord = require('discord.js');
const bot = new Discord.Client();
const schedule = require('node-schedule');
const request = require('request-promise');
const jsonfile = require('jsonfile');
const _ = require('underscore');

var Promise = require('bluebird');
var exec = require('child_process').exec;


var app = new Clapp.App({
    name: cfg.name,
    desc: pkg.description,
    prefix: cfg.prefix,
    separator: '',
    version: pkg.version,
    onReply: (msg, context) => {
        context.msg.reply('\n' + msg, {
            embed: {}
        }).then(bot_response => {
            if (cfg.deleteAfterReply.enabled) {
                context.msg.delete(cfg.deleteAfterReply.time)
                    .then(msg => console.log(`Deleted message from ${msg.author}`))
                    .catch(console.log);
                bot_response.delete(cfg.deleteAfterReply.time)
                    .then(msg => console.log(`Deleted message from ${msg.author}`))
                    .catch(console.log);
            }
        });
    }
});

// Load every command in the commands folder
fs.readdirSync('./lib/commands/').forEach(file => {
    app.addCommand(require("./commands/" + file));
});

bot.on('message', msg => {
    // Fired when someone sends a message
    if (app.isCliSentence(msg.content)) {
        app.parseInput(msg.content, {
            msg: msg
                // Keep adding properties to the context as you need them
        });
    }
});

var botPresences = [{
    status: 'online'
}, {
    game: {
        name: 'with portal space'
    }
}]

bot.login(cfg.token).then(() => {
    console.log('Running!');

    var presence = botPresences[Math.floor(Math.random() * botPresences.length)]
    console.log(presence);
    bot.user.setPresence(presence);

    setInterval(function() {
        bot.user.setPresence(botPresences[Math.floor(Math.random() * botPresences.length)]);
    }, 10000);

});

/** WEBHOOKS **/







// Load webhooks
/////
// fs.readdirSync('./lib/webhooks/').forEach(file => {
//     require("./webhooks/" + file)();
// });

console.log(cfg.webhooks);

var redditWebhook = new Discord.WebhookClient(cfg.webhooks.reddit.id, cfg.webhooks.reddit.token);

console.log(redditWebhook);

var subreddits = ['AsheronsCall', 'AC2'];
var redditTimestamp = './lib/redditTimestamp.json';

var redditSchedule = schedule.scheduleJob('* * * * *', function() {

    console.log('reddit scheduled job fired')

    var requests = [];
    subreddits.forEach(function(subreddit) {
        requests.push(request({
            uri: 'https://www.reddit.com/r/' + subreddit + '/new.json?sort=new',
            method: 'GET'
        }));
    });

    Promise.all(requests).then(subreddits => {

        console.log('All subreddits fetched');

        var now = ((new Date).getTime() / 1000);

        var lastTimestamp = jsonfile.readFileSync(redditTimestamp).timestamp;

        var newPosts = [];

        subreddits.forEach(function(subreddit, index) {
            var body = JSON.parse(subreddit);
            body.data.children.forEach(function(child, index) {
                if (child.data.created_utc > lastTimestamp) {
                    newPosts.push(child);
                }
            });

        });

        console.log(newPosts.length);

        if (_.isEmpty(newPosts)) {
            console.log('No new posts found')
            return false;
        }

        console.log('Found new posts!')
        var sortedPosts = _.sortBy(newPosts, function(post) {
            return post.data.created_utc;
        });

        var postChunks = [];
        var messagePromises = [];

        while (sortedPosts.length) {
            postChunks.push(sortedPosts.splice(0, 10));
        }

        postChunks.forEach(function(chunk) {

            var slackMessage = {
                "attachments": []
            }

            chunk.forEach(function(post) {
                var attachment = {
                    'color': '#ff4500',
                    'author_name': 'New post on /r/' + post.data.subreddit,
                    "author_icon": "https://lh3.googleusercontent.com/J41hsV2swVteoeB8pDhqbQR3H83NrEBFv2q_kYdq1xp9vsI1Gz9A9pzjcwX_JrZpPGsa=w300",
                    'author_link': 'https://www.reddit.com/r/' + post.data.subreddit,
                    'pretext': 'https://redd.it/' + post.data.id,
                    'title': post.data.title,
                    'title_link': 'https://www.reddit.com' + post.data.permalink,
                    'fields': [],
                    'footer': 'Submitted by ' + post.data.author,
                    'ts': post.data.created_utc
                }

                if (post.data.selftext !== '') {
                    attachment.fields.push({
                        'title': 'Preview',
                        'value': post.data.selftext.substring(0, 450) + '...',
                        'short': false
                    })
                }

                if (post.data.preview) {
                    attachment.image_url = post.data.preview.images[0].source.url;
                }

                slackMessage.attachments.push(attachment);

            });

            messagePromises.push(redditWebhook.sendSlackMessage(slackMessage));

        });

        console.log(messagePromises);

        Promise.all(messagePromises).then(messages => {

            console.log('All messages sent');

            // timestamp!!!!

            var obj = {
                timestamp: now
            }

            jsonfile.writeFileSync(redditTimestamp, obj);

            console.log('timestamp updated');

        }).catch(function(e) {
            console.log(e);
        });
    });
});

function promiseFromChildProcess(child) {
    return new Promise(function(resolve, reject) {
        child.stdout.on('data', resolve);
        child.stderr.on('data', reject);
    });
}

var serverQuerySchedule = schedule.scheduleJob('* * * * *', function() {

    var servers = request({
        uri: 'http://api.asheronsdb.com/servers',
        method: 'GET'
    });

    servers.then(results => {

        var results = JSON.parse(results);

        var serverQueries = [];

        results.forEach(function(server) {
            var cmd = 'packetsender -uxw 500 ' + server.address + ' ' + server.port + ' "00 00 00 00 00 00 01 00 e1 a3 f1 08 00 00 00 00 34 00 00 00 04 00 31 38 30 32 00 00 28 00 00 00 01 00 00 00 00 00 00 00 c0 42 a4 58 11 00 75 73 65 72 6e 61 6d 65 3a 70 61 73 73 77 6f 72 64 00 00 00 00 00 00 00 00 00"';

            // 00 00 00 00 00 00 01 00 93 4e f8 27 00 00 00 00 38 00 00 00 04 00 31 38 30 32 00 00 2c 00 00 00 01 00 00 00 00 00 00 00 1a c1 9e 58 14 00 75 73 65 72 6e 61 6d 65 32 36 38 3a 70 61 73 73 77 6f 72 64 00 00 00 00 00 00 00 00 00 00

            var child = exec(cmd);

            var childPromise = promiseFromChildProcess(child);

            childPromise.then(status => {

                console.log('STATUS RESPONSE: ');
                console.log(status);
                console.log('---------------------------------------');

                var jsonPayload = { api_key: cfg.apiKeyTemp };

                if (status.indexOf('Response') !== -1) {
                    // true
                    jsonPayload.online = true;
                } else {
                    //false
                    jsonPayload.online = false;
                }

                console.log(server.name)
                console.log(jsonPayload);

                if (jsonPayload.online !== server.online) {
                    request({
                        uri: 'http://api.asheronsdb.com/servers/' + server.id,
                        method: 'PUT',
                        json: jsonPayload
                    });
                }








            });



        });

    });


});
