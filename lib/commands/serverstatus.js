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

            console.log('Server list results')
            console.log(results)

            var data;
            if (results) {


                data = JSON.parse(results);



                if (data.status !== 'ok') return false;

                var embed = {
                    title: 'Emulator Server Status',
                    fields: []
                };

                var result = _.sortBy(data.result, function(obj) {
                    return obj.name;
                });

                result.forEach(function(server, index) {

                    var emoji;
                    var string;

                    if (server.online) {
                        statusText = 'online';
                        emoji = '<:linkgreen:284492313257050123>'
                        //embed.color = '3066993';
                    } else {
                        statusText = 'offline';
                        emoji = '<:linkred:284492313214976001>'
                        //embed.color = '15158332';
                    }

                    var field = {
                        name: emoji + '  ' + server.name + ' is ' + statusText,
                        value: '**Address:** ' + server.address + '  **Port:** ' + server.port + '  **Emulator:** ' + server.emulator.name + ' (v' + server.emulator.version + ')'
                    }

                    embed.fields.push(field)

                });


                context.msg.channel.sendEmbed(embed);
            } else {
                context.msg.channel.sendMessage('No servers are currently being tracked.');
            }

        }).catch(function(error) {
            console.log('Couldn\'t fetch server list xml');
            console.log(error);
            context.msg.channel.sendMessage('Could not fetch server status. Please try again later.');
        });

    },
    args: [],
    flags: []
});
