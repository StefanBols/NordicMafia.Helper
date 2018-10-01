/*
	Ventetider for handligner:
	Krim: 180 sec
	Biltyveri: 360 sec
	Utpressing: 960 sec
*/
/*
            var premCounters = [['premCounter_airport',null],
            ['premCounter_kriminalitet',null],
            ['premCounter_gta',null],
            ['premCounter_blackmail',null],
            ['premCounter_oc',null],
            ['premCounter_cdg',null],
            ['premCounter_jail',null],
            ['premCounter_fightclub',null],
            ['premCounter_filmmaking',null],
            ['premCounter_hire_bodyguard',null],
            ['premCounter_weapontraining',null]];
			var premCounter_loaded = false;

			var premCounters_oc = 0;
			var premCounters_cdg = 0;
			var premCounters_filmmaking = 0;
			var premCounters_hirebodyguard = 0;
			var premCounters_weapontraining = 0;

			var premCounterInterval = setInterval(function() {premCounter()}, 1000);

*/

var foundKrimCounter = !!document.getElementById('premCounter_kriminalitet');

if (!foundKrimCounter) {
    console.log('Error');
}

$('#krimSubmitButton').click(function() {
    sendNotification(
    'krim', 
    'Kriminalitet',
    'Kriminalitet nu muligt igen',
    180);
});
$('#gtaSubmitButton').click(function() {
    sendNotification(
    'gta', 
    'Biltyveri',
    'Biltyveri nu muligt igen',
    360);
})
$('input[name=submitBlackmail]').click(function() {
    sendNotification(
    'blackmail', 
    'Utpresning',
    'Utpresning nu muligt igen',
    960);
})

var sendNotification = function (type, title, message, timeOffset) {
    console.log('ContentScript sending notification for', type)
    chrome.runtime.sendMessage({
        action: 'sendNotification',
        payload: {
            type: type,
            title: title,
            message: message,
            timeOffset: timeOffset
        }
    }, function(response) {
        console.log("Response: ", response);
    });
}