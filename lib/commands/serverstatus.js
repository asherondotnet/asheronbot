var Clapp = require('../modules/clapp-discord');
var isReachable = require('is-reachable');
var Promise = require('bluebird');
var exec = require('child_process').exec;

function promiseFromChildProcess(child) {
    return new Promise(function(resolve, reject) {
        child.stdout.on('data', resolve);
        child.stderr.on('data', reject);
    });
}

var servers = [{
    name: 'Pea\'s Test Server',
    address: '75.63.120.231',
    port: 9050
}, {
    name: 'Megaduck AC',
    address: 'ac.megaduck.com',
    port: 9050
}, {
    name: 'Yew\'s Plugins Server',
    address: 'ac.yewsplugins.com',
    port: 9999
}]




// packetsender -uxw 500 75.63.120.231 9050 "00 00 00 00 00 00 01 00 93 4e f8 27 00 00 00 00 38 00 00 00 04 00 31 38 30 32 00 00 2c 00 00 00 01 00 00 00 00 00 00 00 1a c1 9e 58 14 00 75 73 65 72 6e 61 6d 65 32 36 38 3a 70 61 73 73 77 6f 72 64 00 00 00 00 00 00 00 00 00 00"
//
// packetsender -uxw 500 66.114.154.100 9050 "00 00 00 00 00 00 01 00 93 4e f8 27 00 00 00 00 38 00 00 00 04 00 31 38 30 32 00 00 2c 00 00 00 01 00 00 00 00 00 00 00 1a c1 9e 58 14 00 75 73 65 72 6e 61 6d 65 32 36 38 3a 70 61 73 73 77 6f 72 64 00 00 00 00 00 00 00 00 00 00"
//
// packetsender -uxw 500 ac.yewsplugins.com 9999 "00 00 00 00 00 00 01 00 93 4e f8 27 00 00 00 00 38 00 00 00 04 00 31 38 30 32 00 00 2c 00 00 00 01 00 00 00 00 00 00 00 1a c1 9e 58 14 00 75 73 65 72 6e 61 6d 65 32 36 38 3a 70 61 73 73 77 6f 72 64 00 00 00 00 00 00 00 00 00 00"


module.exports = new Clapp.Command({
    name: "serverstatus",
    desc: "does foo things",
    fn: (argv, context) => {

        var serverQueries = [];

        servers.forEach(function(server) {
            var cmd = 'packetsender -uxw 500 ' + server.address + ' ' + server.port + ' "00 00 00 00 00 00 01 00 93 4e f8 27 00 00 00 00 38 00 00 00 04 00 31 38 30 32 00 00 2c 00 00 00 01 00 00 00 00 00 00 00 1a c1 9e 58 14 00 75 73 65 72 6e 61 6d 65 32 36 38 3a 70 61 73 73 77 6f 72 64 00 00 00 00 00 00 00 00 00 00"';
            var child = exec(cmd);
            serverQueries.push(promiseFromChildProcess(child));
        });


        // servers.forEach(function(server) {
        //     var cmd = 'packetsender -uxw 500 ' + server.address + ' ' + server.port + ' "00 00 00 00 00 00 01 00 93 4e f8 27 00 00 00 00 38 00 00 00 04 00 31 38 30 32 00 00 2c 00 00 00 01 00 00 00 00 00 00 00 1a c1 9e 58 14 00 75 73 65 72 6e 61 6d 65 32 36 38 3a 70 61 73 73 77 6f 72 64 00 00 00 00 00 00 00 00 00 00"';
        //     var promise = exec(cmd);
        //     serverQueries.push(promise);
        // });

        Promise.all(serverQueries).then(statuses => {



            // console.log(statuses);

            var embed = {
                title: 'Emulator Server Status',
                description: ''
            };

            statuses.forEach(function(status, index) {

                console.log(status);

                var emoji;
                var string;

                if (status.indexOf('Response') !== -1) {
                    statusText = 'online';
                    emoji = ':green_heart:'
                    //embed.color = '3066993';
                } else {
                    statusText = 'offline';
                    emoji = ':red_circle:'
                    //embed.color = '15158332';
                }


                embed.description += emoji + '  ' + servers[index].name +' is '+ statusText + '\n';

            });

            context.msg.channel.sendEmbed(embed);


            //context.msg.channel.sendMessage(, { embed: embeds});


            //context.msg.channel.sendMessage('I could not find "' + searchTerm + '" on the wiki.');
            //=> true

        });


    },
    args: [],
    flags: []
});