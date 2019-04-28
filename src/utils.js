export function get_json(url, params) {
    console.log(url);
    let u = new URL(url);
    Object.keys(params).forEach(key => u.searchParams.append(key, params[key]));
    return fetch(u.href, {
        headers: {'Accept': 'application/json'}
    }).then(response => {
        if (response.status == 404) {
            throw new URIError(`URI ${uri} not found`);
        }
        return response;
    }).then(response => {
        let contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return response.json();
        }
        throw new SyntaxError(`URL ${url} didn't return a response of the require type`);
    });
}

export function get_xml(url, params) {
    console.log(url);
    let u = new URL(url);
    Object.keys(params).forEach(key => u.searchParams.append(key, params[key]));
    return fetch(u.href, {
        headers: {'Accept': 'application/xml'}
    }).then(response => {
        if (response.status == 404) {
            throw new URIError("Entity not found in MDQ server");
        }
        return response;
    }).then(response => {
        let contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/xml")) {
            return response.text();
        }
        throw new SyntaxError(`URL ${url} didn't return a response of the require type`);
    });
}

export function base_url(url) {
    let parser = document.createElement('a');
    parser.href = url;
    return parser.protocol + "//" + parser.host;
}

export function webfinger(base) {
    let u = base + "/.well-known/webfinger";
    return get_json(u, {'rel': 'disco-json'});
}

export function notify_user(message, level, target) {
    let m = $('<div></div>').addClass('alert').addClass('alert-' + level).text(message);
    target.append(m);
}

export function compare(a, b, name) {
    if (a[name] < b[name]) {
        return -1;
    }
    if (a[name] > b[name]) {
        return 1;
    }
    return 0;
}

if (!String.prototype.encodeHTML) {
    String.prototype.encodeHTML = function () {
        return this.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    };
}

const Hogan = require("hogan.js");
const entity_template = Hogan.compile(require('!raw-loader!./templates/entity.html'));

export function lookup(url, query, target) {
    let div = $("<div></div>");
    return get_json(url, {'q': query}).then(data => {
        let count = 0;
        target.empty();
        data.forEach(entity => {
            entity.lid = count;
            div.append(entity_template.render(entity));
            count += 1;
        });
        target.html(div);
        $('i[data-type="idp"]').each(function () {
            $(this).addClass('fa').addClass('fa-lock');
        });
        $('i[data-type="sp"]').each(function () {
            $(this).addClass('fa').addClass('fa-cogs');
        });
        return count;
    }).catch(ex => {
        notify_user(ex, 'warning', target);
        console.log(ex);
        return Promise.resolve(0);
    });
}

export function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

/**
 * Apply an XSLT to transform XML
 * @param {String} xmlText to format
 * @param {String} xsltText to apply
 * @returns {String} formatted XML on success, xmlText on failure
 */
export function transformXML(xmlText, xsltText) {
    // Bomb out if this browser does not support DOM parsing and transformation
    if (!(window.DOMParser && window.XSLTProcessor)) {
        console.log("no parsing capabilities...");
        return xmlText;
    }

    // Load the XSLT into a document
    let xsltDoc = new DOMParser().parseFromString(xsltText, "text/xml");

    // Apply that document to as a stylesheet to a transformer
    let xslt = new XSLTProcessor();
    xslt.importStylesheet(xsltDoc);

    // Load the XML into a document.
    // Trim any preceding whitespace to prevent parse failure.
    let xml = new DOMParser().parseFromString(xmlText.trim(), "text/xml");

    // Transform it
    let transformedXml = xslt.transformToDocument(xml);

    console.log(transformedXml);
    // Apply the transformed document if it was successful
    return (!transformedXml) ? xmlText : new XMLSerializer().serializeToString(transformedXml);
}

export function object2view(o) {
    console.log(o);
    if (o instanceof Object) {
        return Object.keys(o).map(k => {
            let v = object2view(o[k]);
            let r = {'key': k, 'value': null, 'values': []};
            if (v instanceof Array) {
                r.values = v;
            } else {
                r.value = v;
            }
            return r;
        });
    } else {
        return `${o}`.replace(/^\s+|\s+$/g, '');
    }
}