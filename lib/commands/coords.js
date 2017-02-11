var Clapp = require('../modules/clapp-discord');
var _ = require('underscore');
var locations = require('../data/locations.json');

function coordsToGame(lat, long) {
    var y = lat > 0 ? Math.abs(lat).toFixed(2) + "N" : Math.abs(lat).toFixed(2) + "S";
    var x = long > 0 ? Math.abs(long).toFixed(2) + "E" : Math.abs(long).toFixed(2) + "W";
    return y + ', ' + x;
}

function gameToCoords() {


}

module.exports = new Clapp.Command({
    name: "coords",
    desc: "does foo things",
    fn: (argv, context) => {


        var coords = {}

        var latRegex = /^(\d+(\.\d+)?)([NSns])/;
        var longRegex = /^(\d+(\.\d+)?)([EWew])/;

        var latArray = latRegex.exec(argv.args.latitude)
        var longArray = longRegex.exec(argv.args.longitude)

        if (latArray[3] == 'S') {
            coords.lat = -1 * latArray[1];
        } else {
            coords.lat = latArray[1];
        }

        if (longArray[3] == 'W') {
            coords.long = -1 * longArray[1];
        } else {
            coords.long = longArray[1];
        }

        console.log(coords);


        var sortedLocs = _.sortBy(locations, function(loc) {

            var long = loc.longitude;
            var lat = loc.latitude;
            var a = coords.long - long;
            var b = coords.lat - lat;

            var c = Math.sqrt(a * a + b * b);

            return c;

        });

        var closestPoint = sortedLocs[0];

        console.log(closestPoint);

        var embed = {};



        embed.fields = [{
            name: "Nearest Location",
            value: closestPoint.name,
            inline: false
        }, {
            name: "Category",
            value: closestPoint.type,
            inline: true
        }, {
            name: "Coordinates",
            value: coordsToGame(closestPoint.latitude, closestPoint.longitude),
            inline: true
        }, {
            name: "Description",
            value: closestPoint.description,
            inline: false
        }];

        embed.image = {
            url: 'http://i.imgur.com/xvPsEhL.png',
            height: 1074,
            width: 1074
        }

        context.msg.channel.sendMessage('', {
            embed: embed
        });

        //
        // console.log('CONTEXT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        // console.log(context);

        // This output will be redirected to your app's onReply function
        // return 'Foo was executed!' + ' The value of testarg is: ' + argv.args.testarg +
        //     (argv.flags.testflag ? ' testflag was passed!' : '');
    },
    args: [{
        name: 'latitude',
        desc: 'A test argument',
        type: 'string',
        required: true,
        default: 'testarg isn\'t defined',
        validations: [{
            errorMessage: "Invalid longtitude format. For example: 27.2N",
            validate: value => {
                return !!value.match(/^(\d+(\.\d+)?)([NSns])/);
            }
        }]
    }, {
        name: 'longitude',
        desc: 'A test argument',
        type: 'string',
        required: true,
        default: 'testarg isn\'t defined',
        validations: [{
            errorMessage: "Invalid longtitude format. For example: 29.7E",
            validate: value => {
                return !!value.match(/^(\d+(\.\d+)?)([EWew])/);
            }
        }]
    }, {
        name: 'results',
        desc: 'A test argument',
        type: 'string',
        required: false,
        default: 'testarg isn\'t defined'
    }],
    flags: []
});
