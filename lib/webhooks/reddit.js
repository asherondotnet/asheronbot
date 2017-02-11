var request = require('request-promise');
const Discord = require('discord.js');
const fs = require('fs');
const schedule = require('node-schedule');
var remoteUrl = 'http://www.reddit.com/r/AsheronsCall/new.json?sort=new';

var webhooks = {
    reddit: {
        id: 278267342910259200,
        token: 'jan8cbe6Pm6CXWmmL0oz46tRzUObf7lzjk0PzpQzmILdiSxcGlKk0CEuEFsmXEKA-Te_'
    }
};

var redditWebhook = new Discord.WebhookClient(webhooks.reddit.id, webhooks.reddit.token);

module.exports = function() {

    var old = {
        "color": "#cee3f8",
        "author_name": "New post on /r/AsheronsCall",
        "author_link": "https://www.reddit.com/r/AsheronsCall",
        "title": "New post title lorem ipsum",
        "pretext": "https://www.reddit.com/r/AsheronsCall/comments/5rzl8p/scared_and_afraid/",
        "text": "https://www.reddit.com/r/AsheronsCall/comments/5rzl8p/scared_and_afraid/",
        "title_link": "https://www.reddit.com/r/AsheronsCall/comments/5rzl8p/scared_and_afraid/",
        "fields": [{
            "title": "Preview",
            "value": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer a felis tellus. Proin accumsan purus neque, pellentesque mattis magna bibendum sit amet. Nullam at auctor enim. Nullam ullamcorper nisi et sem accumsan, sed suscipit nibh ullamcorper. Aenean sit amet mauris sit amet erat porta cursus et sed risus. Duis accumsan consequat nisl",
            "short": false
        }],
        "image_url": "https://i.redditmedia.com/XlZFhz0Qu1xuXNorH9uQl5r-mLCbtlYRS2xyowJ1Q7M.jpg?fit=crop&crop=faces%2Centropy&arh=2&w=108&s=ab65e45692e10e94f9c6dc387f717c13",
        "footer": "Submitted by Asheron",
        "ts": 1486603880
    }




    var subreddits = ['AsheronsCall', 'AC2'];

    var j = schedule.scheduleJob('* * * * *', function() {

        console.log('reddit scheduled job fired')

        var requests = [];
        subreddits.forEach(function(subreddit) {
            requests.push(request({
                uri: 'http://www.reddit.com/r/' + subreddit + '/new.json?sort=new',
                method: 'GET'
            }));
        });

        Promise.all(requests).then(subreddits => {


            console.log('all requests completed');

            var slackMessage = {
                "attachments": []
            }

            console.log(subreddits.length);

            subreddits.forEach(function(subreddit, index) {

                var body = JSON.parse(subreddit);
                var newPost = body.data.children[0].data;

                var attachment = {
                    'color': '#ff4500',
                    'author_name': 'New post on /r/' + newPost.subreddit,
                    "author_icon": "https://lh3.googleusercontent.com/J41hsV2swVteoeB8pDhqbQR3H83NrEBFv2q_kYdq1xp9vsI1Gz9A9pzjcwX_JrZpPGsa=w300",
                    'author_link': 'https://www.reddit.com/r/' + newPost.subreddit,
                    'pretext': 'https://redd.it/' + newPost.id,
                    'title': newPost.title,
                    'title_link': 'https://www.reddit.com' + newPost.permalink,
                    'fields': [],
                    'footer': 'Submitted by ' + newPost.author,
                    'ts': newPost.created_utc
                }

                if (newPost.selftext !== '') {
                    attachment.fields.push({
                        'title': 'Preview',
                        'value': newPost.selftext.substring(0, 450) + '...',
                        'short': false
                    })
                }

                if (newPost.preview) {
                    attachment.image_url = newPost.preview.images[0].source.url;
                }


                slackMessage.attachments.push(attachment);

            });

            console.log(slackMessage);

            redditWebhook.sendSlackMessage(slackMessage).catch(console.error);

            //slackMessage.attachments[0].author_name = 'New post on /r/' + ,
            //
            //
            // var results = JSON.parse(body);
            //
            // redditSlackMsg.attachments[0].fields[0].value = results.data.children[0].data.title;
            // redditSlackMsg.attachments[0].fields[1].value = results.data.children[0].data.url;
            // redditSlackMsg.attachments[0].fields[2].value = results.data.children[0].data.selftext.substring(0, 450);
            // redditSlackMsg.attachments[0].footer = 'Submitted by ' + results.data.children[0].data.author;
            // redditSlackMsg.attachments[0].ts = results.data.children[0].data.created_utc;
            //
            //redditWebhook.sendSlackMessage(redditSlackMsg).catch(console.error);



        });

    });


};
