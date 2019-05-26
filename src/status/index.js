import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'


import 'jquery-ui';
import 'jquery-ui/ui/widgets/autocomplete';
import 'jquery-ui/ui/widgets/mouse';
import 'bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'json-tree-viewer/libs/jsonTree/jsonTree.css'
import 'code-prettify';
import 'code-prettify/src/prettify.css';
import '../style.css';
import {base_url, get_json, alert_info} from "../lib/utils";
import {jq} from "../lib/events";
require('../config.json');
const Hogan = require("hogan.js");
const status_template = Hogan.compile(require('!raw-loader!../templates/status.html'));

$(document).ready(function () {

    const main = $('*[role="main"]');

    get_json(location.origin+"/config.json",{}).then(config => {
        let url = config.mdq_url || process.env.MDQ_URL;
        let baseurl = base_url(url);

        jq(config);

        $('#server_name').text(config.mdq_servername || process.env.MDQ_SERVERNAME || baseurl);
        $('#headline').text('Server Status');
        $('#subheading').text(baseurl);

        if (config.pyff_apis) {
            get_json(baseurl + "/api/status", {}).then(data => {
                main.html(status_template.render(data));
            });
        }
    });
});