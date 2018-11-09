$(function() {
    $('<style>.customBet:focus {outline: none;}.customBet {line-height: 40px;text-align: center;font-size: 14px;background:none;border: none;}</style>').insertAfter($('head'));
    $('#PageContainer').css('height', '550px');
    
    var $bjInput = $('<input>').addClass('customBet').prop({'placeholder': 'Innsats...'});
    $('<div>').addClass('btn').css({'left': '85px', 'top': '50px'}).append($bjInput).appendTo('#bottomContainer');
    $('<div>').addClass('btn').css({'right': '85px', 'top': '50px'}).html('Sats coins').on('click', () => { customBet($bjInput.val()) }).appendTo('#bottomContainer');
    $('<div>').css({'font-variant': 'small-caps', 'position': 'absolute', 'bottom': '-65px', 'text-align': 'center', 'width': '100%', 'opacity': '.25'}).html('Utvidelse av blackjack laget av <a href="https://www.nordicmafia.org/index.php?p=profile&id=1928">AvE</a>').appendTo('#bottomContainer');
});

//Function to simplify sending error messages to player
function errorMsg(msg){
    $('#messageSign').html(msg);
    $('#messageSign').fadeIn('fast', function() {
        $('#messageSign').fadeOut('slow');
    }).delay(1500);
}
 
function customBet(value){
	//Send error message and return if value is not an integer
    if(isNaN(value)||value === value && value % 1 !== 0){
        errorMsg('Du må skrive inn et heltall!');
        return false;
    }
   
    //Send error message and return if value exceeds the maxbet
    else if(value>maxBet){
        errorMsg('Du har kan ikke satse mer enn ' + maxBet + ' coins!');
        return false;
    }
   
    //Send error message and return if value exceeds the maxbet
    else if(value<minBet){
        errorMsg('Du må satse minimum '+minBet+' coins!');
        return false;
    }
   
	//Send error message and return if value exceeds the players balance
    else if(value>remaining_balance){
        errorMsg('Du har ikke nok coins. <a href="' + Blackjack.getMoreBalanceURL + '"><strong>Skaff flere coins!</strong></a>');
        return false;
    }
   
	//Checks if a game is allready going, send error message if it is
    if(Blackjack.gameState){
        if(Blackjack.gameState.turn==="ended"){//If game is ended
            Blackjack.btnClear();//Empty the table if in case it's not done manually by player
        }
        else{
            errorMsg('Du må spille ferdig runden før du kan spille på nytt!');
            return false;
        }
    }
   
	//Makes sure the bet is an even number to match the chips, unless player went 'all in'
    if(value%2&&value!=remaining_balance)value-=1;
   
    //The actual betting takes place under here.
    Blackjack.curBet = value;
    Blackjack._showBet();
    Blackjack.btnDeal();
}
 
//Lets the player bet by pressing 'enter' inside the text-field
$('#customBet')[0].addEventListener("keydown", function(event){
    if(event.keyCode === 13){
        customBet($(this).val());
    }
});
