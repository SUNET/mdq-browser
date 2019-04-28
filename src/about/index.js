import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'


import 'jquery-ui';
import 'jquery-ui/ui/widgets/autocomplete';
import 'jquery-ui/ui/widgets/mouse';
import 'bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../style.css';
import {base_url, get_json, object2view} from "../utils";

const Hogan = require("hogan.js");
const status_template = Hogan.compile(require('!raw-loader!../templates/status.html'));

$(document).ready(function () {

    const main = $('*[role="main"]');
    let url = process.env.MDQ_URL;
    let baseurl = base_url(url);
    $('#server_name').text(process.env.MDQ_SERVERNAME || baseurl);
    $('#headline').text('Server Info');
    $('#subheading').text(baseurl);
    get_json(baseurl+"/api/status", {}).then(data => {
        main.append(status_template.render({'status': object2view(data)}));
    });

});