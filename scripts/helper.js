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

$(function() {
    var currentPage = window.location.href;

    if (currentPage.includes('p=kriminalitet')) {
        $('#krimSubmitButton').click(function() {
            planNotification('krim');
        });
    }

    if (currentPage.includes('p=gta')) {
        $('#gtaSubmitButton').click(function() {
            planNotification('gta');
        });
            
        if ($('.errorbox').text().includes('Du kom i fengsel')) {
            // Du har lavet GTA og kom i fengsel. Redirect to Jail page
            setTimeout(function() {
                window.location.href='index.php?p=jail'
            }, 2500);
        }
    }

    if (currentPage.includes('p=blackmail')) {
        $('input[name=submitBlackmail]').click(function() {
            planNotification('blackmail');
        });
    }

    
    if ($('input[name=bounty]').length > 0) {
        var jailCountdown = checkJailCountdown();

        if (jailCountdown) {
            planNotification('jail', jailCountdown);
        }
    }
});

var planNotification = function (type, timeOffset) {
    console.log('ContentScript plan notification for', type)
    chrome.runtime.sendMessage({
        action: 'planNotification',
        payload: {
            type: type,
            timeOffset: timeOffset
        }
    }, function(response) {
        console.log("Response: ", response);
    });
}

var checkJailCountdown = function() {
    var jailCountdown;
    // TODO: Get this crap to work!
    // try {
    //     var regex = /'countDown\(([0-9]+), \'jail\'\)'/g;
    //     jailCountdown = regex.exec(document.getElementsByTagName('BODY')[0].innerHTML)[1];
    // } catch(e) {}

    // Ghetto hack
    var source = $('#mainContent script').first().text();
    if (source.includes('countDown(') && source.includes('\'jail\'')) {
        jailCountdown = source.replace(/\D/g,'');
    }

    return jailCountdown;
}