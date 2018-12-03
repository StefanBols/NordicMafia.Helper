function set_i18n(obj, tag) {
    var msg = chrome.i18n.getMessage(tag);
    obj.innerHTML = msg;
}

function localizeHtmlPage() {
    var data = document.querySelectorAll('[data-localize]');

    for (var i in data) if (data.hasOwnProperty(i)) {
        var obj = data[i];
        var tag = obj.getAttribute('data-localize').toString();
        set_i18n(obj, tag);
    }
}

localizeHtmlPage();