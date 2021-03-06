var Clapp = require('../modules/clapp-discord');
var acServers = require('../data/acservers.json');
//var _ = require('underscore');

function normalizeServerName(server) {
  var name = server.toLowerCase();
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function getServerObj(value) {

  var filtered = acServers.filter(function(server) {

    var names = server.names.filter(function(name) {
      return new RegExp('(^)' + name + '($)', 'i').test(value);
    });

    if (names.length > 0) {
      return true;
    } else {
      return false;
    }

  });

  return filtered[0];
}

module.exports = new Clapp.Command({
  name: "leaveserver",
  desc: "Leave an Asheron's Call server role.",
  fn: (argv, context) => {

    var server = getServerObj(argv.args.server_name);

    context.msg.member.guild.roles.forEach(function(role) {


      if (role.name == server.displayName) {

        if (context.msg.member.roles.get(role.id)) {

          context.msg.member.removeRole(role);

          var embed = {};
          var name = context.msg.member.nickname || context.msg.member.user.username;
          embed.title = name + ' left the ' + role.name + ' server';
          embed.color = role.color;
          embed.description = 'You are no longer able to chat in #' + role.name.toLowerCase() + '';

          if (server.icon) {
            embed.thumbnail = {
              url: server.icon
            };
          }
          context.msg.channel.sendEmbed(embed);


        } else {

          console.log('User is not a member of that server')
          context.msg.channel.sendMessage('User is not a member of that server');

        }

        return;
      }
    });


    //console.log(context.msg.member.guild.roles);

    //context.msg.member.user.addRole(argv.args.server)
    //context.msg.member.guild.removeRole('Frostfell');

    // This output will be redirected to your app's onReply function
    // return 'Foo was executed!' + ' The value of testarg is: ' + argv.args.testarg +
    //     (argv.flags.testflag ? ' testflag was passed!' : '');
  },
  args: [{
    name: 'server_name',
    desc: 'The AC1 or AC2 server name.',
    type: 'string',
    required: true,
    validations: [{
      errorMessage: "Not a valid server name.",
      validate: value => {

        var server = getServerObj(value);

        if (server) {
          return true;
        } else {
          return false;
        }

      }
    }]
  }],
  flags: []
});
