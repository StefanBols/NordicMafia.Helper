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

    // If we are at the jail page and there is no bounty input (player not in jail)
    if (currentPage.includes('p=jail') && $('input[name=bounty]').length === 0) {
        // Player with highest bounty
        var user = getUserWithHighestBounty();

        var buttonContainer = $('<div>');
        var utBrytBtn = null;
        if (user) utBrytBtn = $('<button>').attr('onclick', 'window.location.href=\'?p=jail&brytutspiller='+ user.id +'\'').attr('type', 'button').text('Ut bryt ' + user.name + ' (' + user.bounty + ' kr.)');
        
        var refreshBtn = $('<button>').attr('onclick', 'window.location.href=\'\'').text(' Opdater').prepend($('<i>').addClass('fa fa-refresh'));
        if (utBrytBtn) buttonContainer.append(utBrytBtn);
        buttonContainer.append(refreshBtn);

        chrome.storage.sync.get([
            'autoBountyActive',
            'autoBountyFixedBounty',
            'autoBountyTopBountiesWith',
            'autoBountyMaxBounty',
            'autoBountyRoundBountiesUp'
        ], (loadedSettings) => {
            var settings = autoBountyMapping(loadedSettings);
            var autoBountyStatus = !!settings.active; 

            var autoBountyStatusText, autoBountyStatusColor;
            if (autoBountyStatus) {
                autoBountyStatusText = 'aktiv';
                autoBountyStatusColor = 'green';
            } else {
                autoBountyStatusText = 'ikke aktiv';
                autoBountyStatusColor = 'red';
            }

            var leftContainer = $('<div>');
            var autoBountyStatusBtn = $('<button>').text(' Auto Dusør ' + autoBountyStatusText).prepend($('<i>').addClass('fa fa-circle').css('color', autoBountyStatusColor));
            var autoBountyOptionsBtn = $('<button>').attr('onclick', 'window.open(\'' + chrome.runtime.getURL('options/index.html') + '\', \'_blank\')').text(' Indstillinger').prepend($('<i>').addClass('fa fa-pencil'));
            leftContainer.append(autoBountyStatusBtn);
            leftContainer.append(autoBountyOptionsBtn);

            var wrapper = $('<div>');
            wrapper.css({
                'display': 'flex',
                'justify-content': 'space-between'
            });
            wrapper.append(leftContainer);
            wrapper.append(buttonContainer);
            $('#mainContent table').parent().before(wrapper);
        });
    }

    if ($('input[name=bounty]').length > 0) { // We are in jail
        // planNotification for release
        var jailCountdown = checkJailCountdown();
        if (jailCountdown) {
            planNotification('jail', jailCountdown);
        }

        chrome.storage.sync.get([
            'autoBountyActive',
            'autoBountyFixedBounty',
            'autoBountyTopBountiesWith',
            'autoBountyMaxBounty',
            'autoBountyRoundBountiesUp'
        ], (loadedSettings) => {
            var settings = autoBountyMapping(loadedSettings);

            var moneyOnHand = parseInt($('#money_hand').text().replace(/\D/g,''));
            if (moneyOnHand === 0) return;
            var bountyInput = $('input[name=bounty]');
            var bountySubmit = $('[name=doupdatebounty]');
            var bounty = 0;
            if (!settings.active || bountyInput.val() !== '0' || (!settings.fixedBounty && !settings.topBountiesWith)) return;

            if (settings.fixedBounty) {
                bounty = settings.fixedBounty;
            }
            if (!settings.fixedBounty && settings.topBountiesWith) {
                var highestBounty = getUserWithHighestBounty().bounty;
                bounty = highestBounty + settings.topBountiesWith;
                if (settings.roundBountiesUp) bounty = Math.ceil(bounty/5000)*5000;
                if (settings.maxBounty && bounty > settings.maxBounty) bounty = settings.maxBounty;
            }

            // If bounty is more then player has on the hand, set the bounty to what the player can afford
            if (moneyOnHand < bounty) {
                bounty = moneyOnHand;
            }

            bountyInput.val(bounty);
            bountySubmit.click();
        });
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
    });
}

var checkJailCountdown = () => {
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

var getUserWithHighestBounty = () => {
    var rows = $('#mainContent table tr[id]');
        var users = [];
        for(var i = 0; i < rows.length; i++) {
            var row = $(rows[i]);
            var columns = row.find('td');
            if (columns[3].innerText === 'Bryt ut') {
                var id = row.attr('id').replace(/\D/g,'');
                var name = columns[0].innerText;
                var bounty = parseInt(columns[2].innerText.replace(/\D/g,''));
                var gjengBro = columns[0].innerHTML.includes('#E3BB07');
                users.push({id, bounty, name, gjengBro});
            }
        }

        // Find Bros in jail
        var jailedBros = _.where(users, { gjengBro: true });

        // If any Bros jailed - fav. them and only them!
        if (_.any(jailedBros)) users = jailedBros;

        // Sort users by biggest bounty
        users.sort(function(a, b){
            return b.bounty - a.bounty;
        });
        return users[0];
}

var autoBountyMapping = (settings) => {
    return {
        active: settings.autoBountyActive,
        fixedBounty: parseInt(settings.autoBountyFixedBounty),
        topBountiesWith: parseInt(settings.autoBountyTopBountiesWith),
        maxBounty: parseInt(settings.autoBountyMaxBounty),
        roundBountiesUp: settings.autoBountyRoundBountiesUp
    };
}