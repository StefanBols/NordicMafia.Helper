$(function() {
    chrome.storage.sync.get([
        'autoBountyActive',
        'autoBountyFixedBounty',
        'autoBountyTopBountiesWith',
        'autoBountyMaxBounty',
        'autoBountyRoundBountiesUp'
    ], function(settings) {
        console.log('Settings retrieved from storage', settings);
        $('[data-nofixedbountygroup]').toggle(settings.autoBountyFixedBounty === '');
        updateSettings(settings);
    });
});

$('#autoBountyFixedBounty').on('keyup', () => {
    $('[data-nofixedbountygroup]').toggle($('#autoBountyFixedBounty').val() === '');
});

$('#autoBountyActive, #autoBountyFixedBounty, #autoBountyTopBountiesWith, #autoBountyMaxBounty, #autoBountyRoundBountiesUp').on('change', () => {
    console.log('Auto dusør settings changed');

    var settings = {
        autoBountyActive: $('#autoBountyActive').prop('checked'),
        autoBountyFixedBounty: $('#autoBountyFixedBounty').val().replace(/\D/g,''),
        autoBountyTopBountiesWith: $('#autoBountyTopBountiesWith').val().replace(/\D/g,''),
        autoBountyMaxBounty: $('#autoBountyMaxBounty').val().replace(/\D/g,''),
        autoBountyRoundBountiesUp: $('#autoBountyRoundBountiesUp').prop('checked')
    };
    updateSettings(settings);  

    chrome.storage.sync.set(settings, () => {
        console.log('Auto dusør Settings saved');
    }); 
});

var updateSettings = (settings) => {
    console.log('Update settings', settings);
    $('#autoBountyActive').prop(settings.autoBountyActive);
    $('#autoBountyFixedBounty').val(settings.autoBountyFixedBounty);
    $('#autoBountyTopBountiesWith').val(settings.autoBountyTopBountiesWith);
    $('#autoBountyMaxBounty').val(settings.autoBountyMaxBounty);
    $('#autoBountyRoundBountiesUp').prop(settings.autoBountyRoundBountiesUp);        
}