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

const xslt = require('!raw-loader!../templates/normalize.html');

import {base_url, lookup, getUrlParameter} from "../utils";

$(document).ready(function () {

    const main = $('*[role="main"]');
    $('head').append(xslt);

    let url = process.env.MDQ_URL;
    let baseurl = base_url(url);
    let query = getUrlParameter('q').toString().encodeHTML();
    let path = decodeURIComponent($(location).attr('hash')).slice(1);
    $('#server_name').text(process.env.MDQ_SERVERNAME || baseurl);
    $('#headline').text('Search Results');
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

    require('../events');

    lookup(baseurl+path, query, main).then(count => {$('#count').text(`${count}`)});
});