import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'


import 'jquery-ui';
import 'jquery-ui/ui/widgets/autocomplete';
import 'jquery-ui/ui/widgets/mouse';
import 'bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

require('./config.json');

import {webfinger, base_url, alert_info, compare, get_json, navlinks} from "./lib/utils";
import {jq} from "./lib/events";

$(document).ready(function () {

    const entities = [];
    let nav = {};
    const main = $('*[role="main"]');
    let query = "";

    get_json(location.origin+"/config.json",{}).then(config => {
        let url = config.mdq_url || process.env.MDQ_URL;
        let baseurl = base_url(url);

        jq(config);
        $('#server_name').text(config.mdq_servername || process.env.MDQ_SERVERNAME || baseurl);

        webfinger(baseurl).then(wf => {
            return wf.links;
        }).then(links => {
            links.sort(function (a, b) {
                return compare(a, b, 'href');
            });
            return links;
        }).then(links => {
            let parser = document.createElement('a');
            let paths = [];
            links.forEach(link => {
                if (link.href.includes("entities")) {
                    entities.push(link.href)
                } else {
                    parser.href = link.href;
                    let ps = parser.pathname.split('.');
                    ps.pop();
                    paths.push(ps.join('.'))
                }
            });
            nav = paths.reduce(function (hier, path) {
                let x = hier;
                path.split('/').forEach(function (item) {
                    if (!x[item]) {
                        x[item] = {};
                    }
                    x = x[item];
                });
                x.path = path;
                return hier;
            }, {});
            if (Object.keys(nav).includes("")) {
                $('#headline').text('Metadata');
                navlinks(nav[""], main);
            } else {
                $('#headline').text('Empty MDQ Server');
                main.html($('<div>Nothing here...</div>')); // make it stop spinning
            }
            $('#subheading').text(baseurl);
        }).catch(ex => {
            main.html(alert_info('An error occured', ex, 'warning'))
            console.log(ex);
        });
    });
});