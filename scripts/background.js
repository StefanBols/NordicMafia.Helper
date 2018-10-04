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
    console.log("Got an alarm!", alarm);
    var type = alarm.name;

    if (alarm.name === 'jailchecker') {
        $.get('https://nordicmafia.org/index.php?p=jail', (response) => {
            console.log('jailcheck', response);
            if (response.includes('Du er i fengsel!')) {
                console.log('Player jailed');
                return;
            } else {
                console.log('Player free, send jail free notification');
                chrome.alarms.clear('jailchecker')
                type = 'jail';
            }
        });
    }

    chrome.alarms.clear(type); // Remove this alarm, so it's free later

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
            planJailChecker();
            break;
    }

    chrome.alarms.clear(type); // If alarm already excists, remove it
    chrome.alarms.create(type, {
        when: Date.now() + timeOffset*1000
    });
}

var planJailChecker = () => {
    console.log('Planning jailchecker');
    chrome.alarms.get('jailchecker', (alarm) => {
        if (!alarm) {
            chrome.alarms.create('jailchecker', {
                periodInMinutes: .25
            });
        }
    });

}

var sendNotification = function(type, title, message) {
    console.log('Sending notification for ', type)
    chrome.notifications.create(null, {
        type: 'basic',
        iconUrl: 'graphics/icons/notification-icon.png',
        title: title,
        message: message
     }, function (notificationId) {
         // Clear notification after 30 seconds.
         setTimeout(function (notificationId) {
            chrome.notifications.clear(notificationId);
         }, 30000);
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