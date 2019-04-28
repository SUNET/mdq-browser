import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'


import 'jquery-ui';
import 'jquery-ui/ui/widgets/autocomplete';
import 'jquery-ui/ui/widgets/mouse';
import 'bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

const Hogan = require("hogan.js");
const entities = [];
let nav = {};

const links_template = Hogan.compile(require('!raw-loader!./templates/links.html'));

import {webfinger, base_url, notify_user, compare} from "./utils";

$(document).ready(function () {

    const main = $('*[role="main"]');
    let query = "";
    let url = process.env.MDQ_URL;
    let baseurl = base_url(url);
    $('#server_name').text(process.env.MDQ_SERVERNAME || baseurl);

    require('./events');

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
            navlinks(nav[""]);
        } else {
            $('#headline').text('Empty MDQ Server');
            main.html($('<div>Nothing here...</div>')); // make it stop spinning
        }
        $('#subheading').text(baseurl);
    }).catch(ex => {
        notify_user(ex, 'warning', main);
        console.log(ex);
    });

    function navlinks(navs) {
        let links = Object.keys(navs).map( name => {
            let value = {'name': decodeURIComponent(name) }
            let members = Object.keys(navs[name]).map(nav => {
                let o = navs[name][nav];
                return {'name': decodeURIComponent(nav), 'path': o.path, value: nav}
            });
            return {'name': value.name, 'values': members}
        });
        main.empty();
        console.log(links);
        main.append(links_template.render({'links': links}));
        $(`a[href="#${links[0].name}"]`).click();
    }
});