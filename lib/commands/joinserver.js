var Clapp = require('../modules/clapp-discord');
//var _ = require('underscore');

var servers = {
    'Leafcull': {
        icon: 'http://acpedia.org/images/b/b6/Leafcull.png'
    },
    'Morningthaw': {
        icon: 'http://acpedia.org/images/1/11/Morningthaw.png'
    },
    'Darktide': {
        icon: 'http://acpedia.org/images/b/b8/Darktide.png'
    },
    'Harvestgain': {
        icon: 'http://acpedia.org/images/2/2d/Harvestgain.png'
    },
    'Thistledown': {
        icon: 'http://acpedia.org/images/f/f6/Thistledown.png'
    },
    'Verdantine': {
        icon: 'http://acpedia.org/images/a/a1/Verdantine.png'
    },
    'Wintersebb': {
        icon: 'http://acpedia.org/images/4/41/Wintersebb.png'
    },
    'Solclaim': {
        icon: 'http://acpedia.org/images/a/a5/Solclaim.png'
    },
    'Frostfell': {
        icon: 'http://acpedia.org/images/2/24/Frostfell.png'
    },
    'Dawnsong': {}
};

function normalizeServerName(server) {
    var name = server.toLowerCase();
    return name.charAt(0).toUpperCase() + name.slice(1);
}

module.exports = new Clapp.Command({
    name: "joinserver",
    desc: "does foo things",
    fn: (argv, context) => {

        context.msg.member.guild.roles.forEach(function(role) {
            if (role.name == normalizeServerName(argv.args.server)) {
                context.msg.member.addRole(role);

                var embed = {};
                embed.title = context.msg.member.nickname + ' joined the ' + role.name + ' server';
                embed.color = role.color;
                embed.description = 'You are now able to chat in #' + role.name.toLowerCase() + '';

                if (servers[role.name].icon) {
                    embed.thumbnail = { url: servers[role.name].icon };
                }

                context.msg.channel.sendEmbed(embed);

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
        name: 'server',
        desc: 'A test argument',
        type: 'string',
        required: true,
        default: 'testarg isn\'t defined',
        validations: [{
            errorMessage: "Not a valid server name.",
            validate: value => {
                if (servers[normalizeServerName(value)]) {
                    return true
                } else {
                    return false
                }
            }
        }]
    }],
    flags: []
});
