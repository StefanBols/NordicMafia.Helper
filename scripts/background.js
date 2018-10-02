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

    if (msg.action === 'getAutoBountySettings' && callback) {
        var settings = {
            active: true,
            fixedBounty: 50000,
            topBountiesWith: 20000,
            maxBounty: 150000,
            roundBountiesUp: true // Up To Nearest 5k
        }
        callback(settings);
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
     }, (notificationId) => {
         // Clear notification after 30 seconds.
         setTimeout((notificationId) => {
            chrome.notification.clear(notificationId);
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