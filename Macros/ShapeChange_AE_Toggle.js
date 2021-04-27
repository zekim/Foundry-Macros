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
      let form = actor.data.effects.find(f => f.label == AE)
      
      // If Active Effect is not found, raise an error
      if (form !== undefined && form !== null)
      {
      	  // Update the token image and size.
          await token.update({
            img: !form.disabled ? HUMAN : FORM,
            width: !form.disabled ? 1: SCALE ,
            height: !form.disabled ? 1: SCALE 
          })
          // Toggle the Active Effect
          await token.actor.updateEmbeddedEntity("ActiveEffect", {"_id": form._id, "disabled" : !form.disabled});
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
