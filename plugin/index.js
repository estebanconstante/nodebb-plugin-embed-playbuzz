(function(module) {
    "use strict";
    var Plugin = {};
    var cheerio = require('cheerio');
    var posts = module.parent.require("./posts");


    Plugin.parsePlayBuzz = function(data, callback) {

        if (!data || !data.postData || !data.postData.content) {
            return callback(null, data);
        }
        posts.isMain(data.postData.pid, function(err, res) {
            if(res === true) {
                var playBuzzLinkRx = /<a href="(?:https?:\/\/)?(?:www.playbuzz\.com)\/(?:.+|a)\/?([\w\-_]+)(#[^"]*)?"[^>]*>[^<]+<\/a>/;
                var playBuzzRx = /(?:https?:\/\/)(www.playbuzz\.com)\/(.+)\/(.+)/;
                var playBuzzLink = data.postData.content.match(playBuzzLinkRx);

                if (playBuzzLink) {
                    var $ = cheerio.load(playBuzzLink[0]);
                    var url = $('a')[0].attribs.href;
                   //                http://www.playbuzz.com/salonmedia/dissecting-donald-trumps-inaugural-address" data-comments="false" data-recommend="false" data-tags="all" ></div>

                    var replaceCode = '<script type="text/javascript" src="//cdn.playbuzz.com/widget/feed.js"></script><div class="pb_feed" data-key="oembed" data-game="' + url + '"  data-recommend="false" data-game-info="false" data-comments="false" data-tags="all"></div>';
                    // <a href="https://www.playbuzz.com/koloffoneureka10/qu-tan-bien-conoces-el-espa-oloooo" rel="nofollow">https://www.playbuzz.com/koloffoneureka10/qu-tan-bien-conoces-el-espa-oloooo</a>
                    var aTag = '<a href="' + url + '" rel="nofollow">' + url + '</a>';
                    data.postData.content = data.postData.content.replace(aTag, replaceCode);

                    callback(null,data);
                } else {
                    callback(null,data);
                }
            } else {
                callback(null, data);
            }
        });

    };

    module.exports = Plugin;
}(module));
