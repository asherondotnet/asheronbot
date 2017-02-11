var request = require('request-promise');
var remoteUrl = 'http://www.reddit.com/r/AsheronsCall/new.json?sort=new';

module.exports = request({
    uri: remoteUrl,
    method: 'GET'
});
