var jailCheckers = ['jailchecker0', 'jailchecker1', 'jailchecker2', 'jailchecker3', 'jailchecker4', 'jailchecker5'];

chrome.runtime.onMessage.addListener(function(msg, sender, callback) {
    // var notification = new Notification('Notification title', {
    //     icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
    //     body: "Hey there! You've been notified!",
    //   });
    console.log('BackgroundScript recieved message: ', msg);

    // If no action is set, don't go to actions methods
    if (!msg.action) return;

    // Action methods
    if (msg.action === 'planNotification' && msg.payload) {
        planNotification(msg.payload.type, msg.payload.timeOffset);
    }
});

chrome.alarms.onAlarm.addListener(function( alarm ) {
    var type = alarm.name;

    if (jailCheckers.includes(alarm.name)) {
        $.get('https://nordicmafia.org/index.php?p=jail', (response) => {
            if (!response.includes('Du er i fengsel!')) {
                console.log('Player free, send jail free notification');
                // Check chail
                chrome.alarms.get('jail', (alarm) => {
                    clearJailCheckers();
                    if (!alarm) return; // If there is no jail, no need for clearing jail or send notification
                    chrome.alarms.clear('jail');
                    sendNotification('jailchecker', chrome.i18n.getMessage('notification_title_jail'), chrome.i18n.getMessage('notification_message_jail'));
                });
            }
        });
        return;
    }

    chrome.alarms.clear(type); // Remove this alarm, so it's free later

    var title, message;
    
    switch(type) {
        case 'krim':
            title = chrome.i18n.getMessage('notification_title_crime');
            message = chrome.i18n.getMessage('notification_message_crime');
            break;
        case 'gta':
            title = chrome.i18n.getMessage('notification_title_gta');
            message = chrome.i18n.getMessage('notification_message_gta');
            break;
        case 'blackmail':
            title = chrome.i18n.getMessage('notification_title_blackmail');
            message = chrome.i18n.getMessage('notification_message_blackmail');
            break;
        case 'jail':
            title = chrome.i18n.getMessage('notification_title_jail');
            message = chrome.i18n.getMessage('notification_message_jail');
            break;
    }

    if (type === 'jail') clearJailCheckers();

    // Send notification!
    if (title && message) sendNotification(type, title, message);
});

var planNotification = function(type, timeOffset) {
    console.log('Planning notifiction for ', type);
    if (!type) {
        console.error('No type for planning notification!', {
            type,
            timeOffset
        });
        return;
    }
    
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
            planJailChecker();
            break;
    }

    chrome.alarms.clear(type); // If alarm already excists, remove it
    chrome.alarms.create(type, {
        when: Date.now() + timeOffset*1000
    });
}

var planJailChecker = () => {
    console.log('Start planning jailchecker');

    // Start with clearing all checkers
    clearJailCheckers();

    var time = Date.now();
    jailCheckers.forEach((jailChecker) => {
        chrome.alarms.create(jailChecker, {
            when: time,
            periodInMinutes: 1
        });
        time += 60000 / jailCheckers.length;
    });
}
var clearJailCheckers = () => {
    console.log('Clear Jail Checkers');
    jailCheckers.forEach((jailChecker) => {
        chrome.alarms.clear(jailChecker);
    });
}

var sendNotification = function(type, title, message) {
    console.log('Sending notification for ', type);
    chrome.notifications.create(null, {
        type: 'basic',
        iconUrl: 'graphics/icons/notification-icon.png',
        title: title,
        message: message
     }, function (notificationId) {
         // Clear notification after 30 seconds.
         setTimeout(function (notificationId) {
            if (notificationId) chrome.notifications.clear(notificationId);
         }, 30000, notificationId);
     });
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
/* Debugging script for clearing all notifcations
chrome.notifications.getAll((items) => {
  if ( items ) {
      for (let key in items) {
          chrome.notifications.clear(key);
      }
  }
});
*/