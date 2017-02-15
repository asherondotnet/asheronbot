var Clapp = require('../modules/clapp-discord');
var request = require('request-promise');

module.exports = new Clapp.Command({
  name: "serverstatus",
  desc: "Check the status of available AC emulator servers.",
  fn: (argv, context) => {

    var servers = request({
      uri: 'http://api.asheronsdb.com/servers',
      method: 'GET'
    });

    servers.then(results => {

      // console.log(statuses);

      var results = JSON.parse(results);

      var embed = {
        title: 'Emulator Server Status',
        fields: []
      };

      results.forEach(function(server, index) {

        var emoji;
        var string;

        if (server.online) {
          statusText = 'online';
          emoji = ':green_heart:'
            //embed.color = '3066993';
        } else {
          statusText = 'offline';
          emoji = ':red_circle:'
            //embed.color = '15158332';
        }

        var field = {
          name: emoji + '  ' + server.name + ' is ' + statusText,
          value: '**Address:** ' + server.address + '  **Port:** ' + server.port + '  **Emulator:** ' + server.emulator.name + ' (v' + server.emulator.version + ')'
        }

        embed.fields.push(field)

      });

      context.msg.channel.sendEmbed(embed);
    });

  },
  args: [],
  flags: []
});
