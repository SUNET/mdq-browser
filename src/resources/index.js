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
import {base_url, get_json, o2a} from "../lib/utils";
import {jq} from "../lib/events";
require('../config.json');
const Hogan = require("hogan.js");
const resources_template = Hogan.compile(require('!raw-loader!../templates/resources.html'));

$(document).ready(function () {

    const main = $('*[role="main"]');

    get_json(location.origin+"/config.json",{}).then(config => {
        let url = config.mdq_url || process.env.MDQ_URL;
        let baseurl = base_url(url);

        jq(config);

        function _sz(o) {
            if (!o) { return 0 };
            return Object.keys(o).length;
        }

        function depth_first_idx(data, i) {
            data.forEach(o => {
                o.idx = i++;
                if (o['Children']) {
                    i = depth_first_idx(o['Children'], i);
                }
            });
            return i;
        }

        function resource_view(data) {
            data.forEach(nfo => {
                if (nfo['HTTP Response Headers']) {
                    nfo['HTTP Response Headers']['Reason'] = nfo['Reason'];
                    nfo['HTTP Response Headers']['Status Code'] = nfo['Status Code'];
                    nfo['HTTP'] = o2a(nfo['HTTP Response Headers']);
                    nfo['ISHTTP'] = true;
                    delete nfo['HTTP Response Headers'];
                }
                if (_sz(nfo['Validation Errors']) > 0) {
                    nfo['HasInvalids'] = true;
                    nfo['Validation Errors'] = o2a(nfo['Validation Errors'])
                }
                if (nfo['Children']) {
                    nfo['HasChildren'] = true;
                }
            });
            return {'values': data};
        }

        function render_resource(resources, place) {
            let v = resource_view(resources);
            place.append(resources_template.render(v));
            resources.forEach(nfo => {
                if (nfo['Children']) {
                    render_resource(nfo['Children'], place);
                }
            });
        }

        $('#server_name').text(config.mdq_servername || process.env.MDQ_SERVERNAME || baseurl);
        $('#headline').text('Resources');
        $('#subheading').text(baseurl);
        if (config.pyff_apis) {
            get_json(baseurl + "/api/resources", {}).then(data => {
                main.empty();
                console.log(data);
                depth_first_idx(data, 0);
                render_resource(data, main);
                $('.resourcestatus').click();
            });
        }
    });
});