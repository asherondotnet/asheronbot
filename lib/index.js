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

// var botPresences = [{
//     status: 'online'
// }, {
//     game: {
//         name: 'with portal space'
//     }
// }]

bot.login(cfg.token).then(() => {
    console.log('Running!');

    // var presence = botPresences[Math.floor(Math.random() * botPresences.length)]
    // console.log(presence);
    // bot.user.setPresence(presence);
    //
    // setInterval(function() {
    //     bot.user.setPresence(botPresences[Math.floor(Math.random() * botPresences.length)]);
    // }, 100000);

});
