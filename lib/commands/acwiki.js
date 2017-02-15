var Clapp = require('../modules/clapp-discord');
var request = require('request-promise');
var wtf_wikipedia = require('wtf_wikipedia');

module.exports = new Clapp.Command({
    name: "acwiki",
    desc: "Look up an article on the AC Community Wiki",
    fn: (argv, context) => {

        var content = context.msg.content;
        var searchTerm = content.substr(content.indexOf(' ') + 1);

        console.log(searchTerm);

        var searchUrl = 'http://acpedia.org/api.php?action=opensearch&search=' + searchTerm + '&limit=1&namespace=0&format=json';

        var searchWiki = request({
            uri: searchUrl,
            method: 'GET'
        });

        searchWiki.then(function(body) {

            var searchResults = JSON.parse(body);
            console.log(searchResults);

            if (searchResults[1].length > 0) {

                var wikiUrl = 'http://acpedia.org/wiki/';
                var parseUrl = 'http://acpedia.org/api.php?action=parse&page=' + searchResults[1][0] + '&prop=wikitext|images|externallinks|sections|revid|displaytitle&format=json&redirects=true&callback=?';

                var wikiImageUrl = 'http://acpedia.org/api.php?action=query&prop=imageinfo&iiprop=url&format=json&titles=File:';

                var searchWiki = request({
                    uri: parseUrl,
                    method: 'GET'
                });


                searchWiki.then(function(body) {

                    var article = JSON.parse(body.substring(1, body.length - 1));

                        //console.log(article);


                        var summary = wtf_wikipedia.plaintext(article.parse.wikitext['*']);

                        console.log(summary);


                    if (article.error) {

                        context.msg.channel.sendMessage('I could not find "' + searchTerm + '" on the wiki.');

                    } else {

                        var fixedTitle = article.parse.title.split(' ').join('_');

                        //return article;

                        var embed = {};

                        if (summary.length > 450) {
                            summary = summary.substring(0, 450) + '...';
                        }

                        embed.title = article.parse.displaytitle;
                        embed.footer = {
                            text: 'Asheron\'s Call Community Wiki',
                            icon_url: 'http://acpedia.org/favicon.ico'
                        }
                        embed.description = wikiUrl + fixedTitle;

                        embed.fields = [{
                            'name': 'Preview',
                            'value': summary
                        }];

                        if (article.parse.images === undefined || article.parse.images.length == 0) {


                            context.msg.channel.sendMessage('', {
                                embed: embed
                            });

                        } else {

                            request({
                                uri: wikiImageUrl + article.parse.images[0],
                                method: 'GET'
                            }, function(error, response, body) {

                                var image = JSON.parse(body);

                                //console.log(image.query.pages[Object.keys(image.query.pages)[0]].imageinfo);
                                var imageInfo = image.query.pages[Object.keys(image.query.pages)[0]].imageinfo;

                                if (imageInfo) {
                                    embed.image = {
                                        url: imageInfo[0].url
                                    }
                                }

                                context.msg.channel.sendMessage('', {
                                    embed: embed
                                });

                            });

                        }



                    }


                });




































            } else {

                context.msg.channel.sendMessage('I could not find "' + searchTerm + '" on the wiki.');
            }

        });






        // return 'Hello!';
        //




        // , function(error, response, body) {
        //
        //     //console.log(body);
        //
        //     var article = JSON.parse(body.substring(1, body.length - 1));
        //
        //     console.log(article);
        //
        //     return article;
        //
        //     var payload = {};
        //     payload.channel = req.body.channel_id;
        //     payload.user_name = "ACCWiki";
        //
        //     if (article.error) {
        //
        //         payload.text = "That article doesn't exist.";
        //         //slackSend(payload);
        //         return res.status(200).end();
        //
        //     } else {
        //
        //         payload.attachments = [{}];
        //
        //         var fixedTitle = article.parse.title.split(' ').join('_');
        //         payload.attachments[0].fallback = article.parse.displaytitle + " (" + wikiUrl + fixedTitle + ")";
        //
        //         payload.attachments[0].title = article.parse.displaytitle;
        //         payload.attachments[0].title_link = wikiUrl + fixedTitle;
        //         payload.attachments[0].text = wikiUrl + fixedTitle;
        //         payload.attachments[0].color = "#444444";
        //
        //         if (article.parse.images === undefined || article.parse.images.length == 0) {
        //
        //             slackSend(payload);
        //             return res.status(200).end();
        //
        //         } else {
        //
        //             request({
        //                 uri: wikiImageUrl + article.parse.images[0],
        //                 method: 'GET'
        //             }, function(error, response, body) {
        //
        //                 var image = JSON.parse(body)
        //                 payload.attachments[0].image_url = image.query.pages[Object.keys(image.query.pages)[0]].imageinfo[0].url;
        //
        //                 slackSend(payload);
        //                 return res.status(200).end();
        //
        //             });
        //
        //         }
        //     }
        //
        // });







        //
        //
        // console.log('CONTEXT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        // console.log(context);
        //
        // // This output will be redirected to your app's onReply function
        // return 'Foo was executed!' + ' The value of testarg is: ' + argv.args.testarg +
        //     (argv.flags.testflag ? ' testflag was passed!' : '');
    },
    args: [],
    flags: []
});
