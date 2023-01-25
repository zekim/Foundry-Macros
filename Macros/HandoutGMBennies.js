// Copyright 2021, Michael Zebrowski
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// Purpose:
// To handout bennies to all GM characters and to the GM.  
//
// The Joker's Wild setting rule allows players and characters to receive bennies when a character on thier
// side draws a Joker during combat. 
// 
// The SWADE system will automatically grant bennies to players; however, it does not do the same for GM Wildcards nor the GM.
// This macro will assign those bennie when executed.
//
// Limitations:  
//  1) The macro will only assign Bennies to Actors that are in the current combat encounter tracker.
//  2) The macro identifies GM characters as those not owned by a player with the Hostile disposition.

// ////////////////////////////////
//         Code Section 
// ////////////////////////////////
async function HandoutGMBennies()
{

   // 1. Gets a list of all actors in the current combat.
   // 2. Filters on NPC status (hasPlayerOwner == false) and wildcard (isWildcard == true) attributes with a hostile disposition (token.disposition < 0)
   // 3. Increase the bennies by 1 for each remaining actor.
   await game.combat.combatants.filter(a => a.actor.hasPlayerOwner == false && a.actor.isWildcard == true  && a.token.disposition < 0).forEach(a => a.actor.getBenny())

   // Fetchs the number of bennies that the GM has
   let b = game.user.getFlag("swade","bennies");
   // Increases the number of bennies by 1 and sets the value
   await game.user.setFlag("swade","bennies", b + 1);
   let c = game.user.getFlag("swade","bennies");
   ui.notifications.info(`GM had ${b} bennies; They now have ${c} bennies.`);
}

// Call the async function
HandoutGMBennies();
