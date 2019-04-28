import {base_url, get_xml, lookup, transformXML} from "./utils";
import 'code-prettify';

let url = process.env.MDQ_URL;
let baseurl = base_url(url);

$("#search").on('keyup', function (e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        $('#searchform').submit();
    }
});

$('.spin-delay').each(function () {
    let me = $(this);
    let timer = setTimeout(function () {
        if (me.children().length === 0 && me.text().length === 0) {
            me.append($('<i></i>').addClass('fa').addClass('fa-spin').addClass('fa-spinner'))
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
});

$('body').on('show.bs.tab', e => {
    let t = $(e.target);
    let o = $(t.attr('href'));
    let xmldiv = o.find('*[data-action="xml"]');
    if (xmldiv && !xmldiv.hasClass('prettyprinted')) {
        let id = xmldiv.data('href');
        get_xml(baseurl + "/entities/" + encodeURIComponent(id), {}).then(xml => {
            xmldiv.html(PR.prettyPrintOne(transformXML(xml, $('#xslt').text()).encodeHTML(), "html", true));
            xmldiv.addClass("prettyprinted");
        });
    }
});