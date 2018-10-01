chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    // var notification = new Notification('Notification title', {
    //     icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
    //     body: "Hey there! You've been notified!",
    //   });
    console.log('BackgroundScript recieved message: ', msg);
    sendResponse('Recieved a message from ContentScript');

    if (msg.action && msg.action === 'sendNotification' && msg.payload) {
        sendNotificationByPayload(msg.payload);
    }
});

var sendNotificationByPayload = function(payload) {
    sendNotification(payload.type, payload.title, payload.message, payload.timeOffset);
}

var sendNotification = function(type, title, message, timeOffset) {
    console.log('Sending notification with 5s delay')
    chrome.notifications.create('reminder', {
        type: 'basic',
        iconUrl: 'graphics/icons/icon.png',
        title: 'Don\'t forget!',
        message: 'Wake up, dude!',
        eventTime: Date.now() + 5000
     }, function(notificationId) { console.log });
}