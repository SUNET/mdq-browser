import {base_url, get_json, get_xml, transformXML, template} from "./utils";
import 'code-prettify';
import {create} from "json-tree-viewer/libs/jsonTree/jsonTree"
const yaml = require('js-yaml');

export function jq(config) {

    let url = config.mdq_url || process.env.MDQ_URL;
    let baseurl = base_url(url);

    $("#search").on('keyup', function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            $('#searchform').submit();
        }
    });

    if (config.pyff_apis) {
        $('.pyff-api').show();
    }

    $('.spin-delay').each(function () {
        let me = $(this);
        let timer = setTimeout(function () {
            if (me.children().length === 0 && me.text().length === 0) {
                let inner = $('<i></i>').addClass('fa').addClass('fa-spin').addClass('fa-spinner');
                if (me.data('spin-class')) {
                    inner.addClass(me.data('spin-class'));
                }
                me.append(inner);
            }
        }, me.data('spin-delay'));
    });

    $('body').on('error', 'img', function () {
        console.log(this);
        let img = $(this);
        console.log(img);
        let p = img.parent;
        img.remove();
        p.append($('<small></small>').addClass("text-muted").removeClass('img-thumbnail').text(`${img.src()} errored`));
    }).on('show.bs.tab', e => {
        let t = $(e.target);
        let o = $(t.attr('href'));
        let div = o.find('*[data-action]');
        let action = div.attr('data-action');
        let ref = div.data('href');
        if (action === 'samlmd' && !div.hasClass('prettyprinted')) {
            get_xml(url + encodeURIComponent(ref), {}).then(xml => {
                div.html(PR.prettyPrintOne(transformXML(xml, $('#xslt').text()).encodeHTML(), "html", true));
                div.addClass("prettyprinted");
            });
        } else if (action === 'json') {
            get_json(baseurl + ref, {}).then(data => {
                div.empty();
                let tree = create(data, div[0]);
                tree.expand(function (node) {
                    return node.childNodes.length < 3 || Number.isInteger(node.label);
                })
            });
        } else if (action === 'template') {
            get_json(baseurl + ref, {}).then(data => {
                div.empty();
                let tn = div.data('template');
                for (let i = 0; i < data.length; i++) {
                    data[i].pos = i;
                }
                let v = {'values': data};
                div.html(template(tn, v))
            });
        } else if (action === 'yaml') {
            get_json(baseurl + ref, {}).then(data => {
                const yml = yaml.safeDump(data[0]);
                console.log(yml);
                div.html(PR.prettyPrintOne(yml, 'yaml'));
                div.addClass("prettyprinted");
            });
        }
    });
}