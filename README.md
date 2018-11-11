# NordicMafia Helper v1.4
Get desktop notification in-game.

This is a helper for the Nordic Mafia browser game.

It's NOT a bot nor a official extension.


This NM Helper primarily send the user some desktop notification when countdowns are over on different actions.

## Roadmap
See issues to get a roadmap for the future ;-)

Feel free to add issues, both bugs and features requests!
## Release notes
### v1.4
- New notification for fightclub battles. It will notify the player after 30 sec. See issue #49 (submitted by [Casango](https://www.nordicmafia.org/index.php?p=profile&id=15))
- New feature: The helper now auto refresh jail page when player is broken out of jail. See issue #25
- New feature: It's now possible to see status on Auto Dusør and go to settings while in jail. See issue #50
- New feature (needs premium timers): A custom background on all pages will show when the player is in jail and will be removed when the player is out jail, either because timer runs out or another player breaks the player out. 
- Fixed bug in Blackjack Helper
- Fixed an english translation which were norwegian
### v1.3.2
- Added helper to Blackjack Singleplayer (thanks to [AvE](https://www.nordicmafia.org/index.php?p=profile&id=1928))
### v1.3.1
- Made changes to a translation for better understanding
### v1.3
- Norwegian translations (thanks to [Endtime](https://www.nordicmafia.org/index.php?p=profile&id=95))
- New feature: In jail the bounty button that serves the player with highest reward now favorites fellow gjengmembers regardless of other players rewards.
- Fixed bug with "Utbrytning"-notification comming when players jail time runs out.
- Localization added for all pages and features
- Some all around grammar fixes
- Bug fix: Tried to fix user reported error with Jail Checkers that are going crazy and spamming the user. Suspect that user uses old version of Chrome and therefore migrated some code to lower version of javascript. (Issue #37)
### v1.2
- Added more obvious settings button for AutoBounty (AutoDusør), issue #24 
### v1.1
- New feature: In jail a new button is there which shows the player who gives the highest reward for the jailbreak. Click on button start action to break player out.
- New feature: AutoBounty (Auto dusør) in jail with posibilities to top other players with a givent amount and set a max bounty and round bounty to nearest 5.000 - set these settings by the options page click the "Auto Dusør Aktiv/Ikke aktiv" button in jail
- New feature: You'll now get a notification if someone helps you escape jail (bryt ut) - Checks every ~10 seconds 
- Bug fix: Tried to fix issue #11 where notifications repeats themselves - time will tell if it works.
- Bug fix: Issue #21, Clearing notification giving undefined
- Bug fix: Issue #20, If no player is in jail a nullpointer is thrown when using the player with the highest bounty.
### v1.0
- Desktop notification: Crime (kriminalitet) is open
- Desktop notification: GTA (biltyveri) is open
- Desktop notification: Blackmail (utpresning) is open
- Desktop notification: When you are out of jail again
