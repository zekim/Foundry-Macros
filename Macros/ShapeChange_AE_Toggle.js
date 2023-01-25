// Copyright 2021, Michael Zebrowski
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// Purpose:
// Active Effects allow a character sheet's stats to be overridden.  By using Active Effects, a player only needs to maintain one character sheet instead of maintaining one character sheet per form that they transform into.
// This macro will turn on the Active Effect that used for a shapeshifted form and update the token's image to match.
// If the Active Effect is already on, the macro will turn off the Active Effect and update the token's image to match the characters base form.
//
// Limitations:  
//  1) The macro works with only one form; future updates will incude the ability to pick between multiple forms.
//  2) The macro does not create the Active Effect. It needs to be added to the character ahead of time.
//  3) Skills are not created or remove.  If a skill does not exist in a form, make it d4-2


// Change Log
// July 15, 2021  Updated to Foundry 0.8.8
// August 5, 2021  Corrected the updating of skills to include attritue and wild die

// ////////////////////////////////
//         Setup Section 
// ////////////////////////////////

// The following four variables control the Macro.  All four need to be set to work properly.

//File Path to the Image of ShapeShifted Form
let FORM = "<Replace with the File Path to the Image of ShapeShifted Form>"

//File Path to the Image of Human Form
let HUMAN = "<Replace with the File Path to the Image of Human Form>"

// The size of the shape shifted token in game units (inches); Human standard is 1
let SCALE = 1

// The Active Effect to Toggle. Name needs to be exact.
let AE = "<Replace with name of Active Effect>"

// Array of Skills to modify when shape shifting
let SKILLS = [
 {skill:"Example",human:{sides:4, modifier:0,attribute:"smarts","wild-die":6 },form:{sides:8, modifier:0,attribute:"smarts","wild-die":6 }},
];


// ////////////////////////////////
//         Code Section 
// ////////////////////////////////
// The code below does not need to be modified.  The four controling variables are set above.

async function ShapeChange_AE_Toggle() 
{
	// Make sure that we have a token selected and that we own it
   if (actor !== undefined && actor !== null && actor.owner)
   {   	  
      // Look for the Active Effect
      let form = actor.data.effects.find(f => f.data.label == AE)
      
      // If Active Effect is not found, raise an error
      if (form !== undefined && form !== null)
      {
         // Update the token image and size.
         await token.document.update({
            img: !form.data.disabled ? HUMAN : FORM,
            width: !form.data.disabled ? 1: SCALE ,
            height: !form.data.disabled ? 1: SCALE 
          })
          
         // Toggle the Active Effect
         await form.update({"disabled" : !form.data.disabled});

         // Loop through the skills and update
         // The easiest way (that I have found) is to create a JSON string and call importFromJSON
         for (let i = 0 ; i < SKILLS.length; i++)
         {
         	  // look for the skill by name
            let skill = actor.data.items.find( a => a.name == SKILLS[i].skill);
            
            // reusable object to update skills
            let update = {data:{die : {sides :4, modifier : 0}, attribute:"","wild-die":{sides:6} }}
            
            // If the skill is found, update it.
            if (skill)
            { 
               update.data.die.sides = SKILLS[i][form.data.disabled ? "human":"form"].sides;
               update.data.die.modifier = SKILLS[i][form.data.disabled ? "human":"form"].modifier ;
               update.data.attribute = SKILLS[i][form.data.disabled ? "human":"form"].attribute ;
               update.data["wild-die"]["sides"]= SKILLS[i][form.data.disabled ? "human":"form"]["wild-die"];
               
               // call importFromJSON to update the skill  
               await skill.importFromJSON(JSON.stringify(update))
            }
         }
      }
      else
      {
         ui.notifications.warn(`Active Effect ${AE} not found on token`);
      }
   }
   else
   {
      ui.notifications.warn("Please select a token.");
   }
}
ShapeChange_AE_Toggle();
