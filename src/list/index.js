import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'


import 'jquery-ui';
import 'jquery-ui/ui/widgets/autocomplete';
import 'jquery-ui/ui/widgets/mouse';
import 'bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../style.css';
import 'code-prettify/src/prettify.css';
require('../config.json');

const xslt = require('!raw-loader!../templates/normalize.html');

import {base_url, lookup, getUrlParameter, get_json} from "../lib/utils";
import {jq} from "../lib/events";


$(document).ready(function () {

    const main = $('*[role="main"]');
    $('head').append(xslt);

    get_json(location.origin+"/config.json",{}).then(config => {
        let url = config.mdq_url || process.env.MDQ_URL;
        let baseurl = base_url(url);

        jq(config);

        $('#server_name').text(config.mdq_servername || process.env.MDQ_SERVERNAME || baseurl);
        $('#headline').text('Search Results');

        let query = getUrlParameter('q').toString().encodeHTML();
        let path = decodeURIComponent($(location).attr('hash')).slice(1);


        let info = "";
        if (query) {
            info += `Searching for '${query}'`;
            if (path) {
                info += " in ";
            } else {
                info += " in all entities"
            }
        }
        if (path) {
            info += path;
        }
        $('#subheading').text(info);
        $('#search').val([query]);

        lookup(baseurl + path, query, main).then(count => {
            $('#count').text(`${count}`)
        });
    });
});