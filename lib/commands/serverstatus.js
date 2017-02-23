var Clapp = require('../modules/clapp-discord');
var request = require('request-promise');
var _ = require('underscore');

module.exports = new Clapp.Command({
    name: "serverstatus",
    desc: "Check the status of available AC emulator servers.",
    fn: (argv, context) => {

        var servers = request({
            uri: 'http://api.asheron.net/servers',
            method: 'GET'
        });

        servers.then(results => {

            // console.log(statuses);

            var results = _.sortBy(JSON.parse(results), function(result) { return result.name; });

            if (results.status !== 'ok') return false;

            console.log(results);

            var embed = {
                title: 'Emulator Server Status',
                fields: []
            };

            results.result.forEach(function(server, index) {

                var emoji;
                var string;

                if (server.online) {
                    statusText = 'online';
                    emoji = '<:triangleplain:277622350344749066>'
                        //embed.color = '3066993';
                } else {
                    statusText = 'offline';
                    emoji = '<:vitae:277622350332166144>'
                        //embed.color = '15158332';
                }

                var field = {
                    name: emoji + '  ' + server.name + ' is ' + statusText,
                    value: '**Address:** ' + server.address + '  **Port:** ' + server.port + '  **Emulator:** ' + server.emulator.name + ' (v' + server.emulator.version + ')'
                }

                embed.fields.push(field)

            });

            context.msg.channel.sendEmbed(embed);
        }).catch(function(error) {
            console.log('Couldn\'t fetch server list xml');
            console.log(error);
            context.msg.channel.sendMessage('Could not fetch server status. Please try again later.');
        });

    },
    args: [],
    flags: []
});
