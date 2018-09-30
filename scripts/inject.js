var token;
try {
    var regex = /'Bearer[\s]+([A-z0-9\-]*)'/g;
    token = regex.exec(document.getElementsByTagName('HEAD')[0].innerHTML)[1];
} catch(e) {}

if (!token) {
    alert('You have to be logged in ;-)');
} else {
    var textArea = document.createElement("textarea");
    textArea.value = token;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    var successful = document.execCommand('copy');

    if (successful) {
        alert('Bearer token copied to clipboard!');
        document.body.removeChild(textArea);
    } else {
        alert('Token couldn\'t be copied to clipboard.\nCheck bottom of this page for a textarea with the token.');
    }
}

