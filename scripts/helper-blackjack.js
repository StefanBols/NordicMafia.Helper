var runBlackjackHelper = () => {
    console.log('Helper running');
    
    //Disabled untill Bols fixes the CSS and HTML
    //initElements();

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
            else{//Function to simplify sending error messages to player
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


    //Adds text field and button on page
    //Its the button is not perfectly aligned, if you know how to fix it, please do
    function initElements(){
        $('<div id="customBetContainer"><div class="customBetInput"><input type="text" name="customBet" placeholder="Innsats.." id="customBet"></div><div id="btnInstructions" class="btn" onclick="customBet($(\'#customBet\').val());" )="">Sats coins</div></div>').insertAfter($("#PageContainerInner"));
        $('<style>#customBet:focus {box-shadow: 0 0 3pt .5pt #7e4805;outline: 0px;}#customBet {position: absolute;width: 170px;height: 40px;left: 89px;border-radius:  15px;border: 1px solid #7e4805;line-height: 40px;text-align: center;font-size: 14px;}</style>').insertAfter($('head'));
        $('#PageContainer').css('height', '525px');
    }
}
