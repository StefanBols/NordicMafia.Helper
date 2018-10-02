chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    // var notification = new Notification('Notification title', {
    //     icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
    //     body: "Hey there! You've been notified!",
    //   });
    console.log('BackgroundScript recieved message: ', msg);
    sendResponse('Recieved a message from ContentScript');

    if (msg.action && msg.action === 'planNotification' && msg.payload) {
        planNotification(msg.payload.type, msg.payload.timeOffset);
    }
});

chrome.alarms.onAlarm.addListener(function( alarm ) {
    console.log("Got an alarm!", alarm);
    chrome.alarms.clear(alarm.name); // Remove this alarm, so it's free later

    var type = alarm.name;
    var title, message;
    
    switch(type) {
        case 'krim':
            title = 'Kriminalitet - Klar!';
            message = 'Det er nu muligt at prøve kriminalitet igen';
            break;
        case 'gta':
            title = 'Biltyveri - Klar!';
            message = 'Det er nu muligt at prøve biltyveri igen';
            break;
        case 'blackmail':
            title = 'Utpresning - Klar!';
            message = 'Det er nu muligt at prøve utpresning igen';
            break;
        case 'jail':
            title = 'Fengsel';
            message = 'Du er nu ude af fengslet';
            break;
    }

    // Send notification!
    if (title && message) sendNotification(type, title, message);
});

var planNotification = function(type, timeOffset) {
    console.log('Planning notifiction for ', type);
    
    timeOffset = timeOffset || 0;

    switch(type) {
        case 'krim':
            timeOffset = 180;
            break;
        case 'gta':
            timeOffset = 360;
            break;
        case 'blackmail':
            timeOffset = 960;
            break;
        case 'jail':
            // timeOffset comes from parameter
            break;
    }

    chrome.alarms.clear(type); // If alarm already excists, remove it
    chrome.alarms.create(type, {
        when: Date.now() + timeOffset*1000
    });
}

var sendNotification = function(type, title, message) {
    console.log('Sending notification for ', type)
    chrome.notifications.create(null, {
        type: 'basic',
        iconUrl: 'graphics/icons/notification-icon.png',
        title: title,
        message: message
     }, function(notificationId) {});
}


/* Debugging script for checking alarms
chrome.alarms.getAll(function(alarms) {
  console.log(alarms);
	for(var i=0; i<alarms.length;i++) {
		var alarm = alarms[i];
		console.log(alarm.name, (alarm.scheduledTime-Date.now())/1000)
	}
});
*/
