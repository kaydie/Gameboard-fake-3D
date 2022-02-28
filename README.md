# gameboard3d

Gameboard-fake-3D

To install: npm i
To run: npm run start

Manual control is here!

Click on the head to control the character.
After the 'head shake' you can control the character with the arrow keys.
[up], [down], [left], [right], [left up], [left down], [right up], [right down]
The member last clicked on the head is under your control.
You can switch control by clicking another members head. 
(double click if the member is in stand by mode but does not have focus.)

Click the dots on the grid to add (up to 15) characters
Every beep a new 'random steps' cycle starts for the members.
Mind... you may have to wait a bit for the first member
returns on stage, because of the timer / interval cycle.
Working on that...

Manual control added!
css fat legs bug in chrome is fixed!
(new) members appear on the dot clicked in the grid
(new) reposition on window resize
hovering over the character halts the character 
clicking the character freezes the character
clicking oh head = head shake

(noisy) timed soundeffects! 
Added stacked layers (floors)
Added texture gradients
Added more animated walks

Used Webpack to compile (Still WIP)
If anyone is interested let me know
I put the source on github

todo: 
add 'loading...' screen / modal
limit the max simultaniously played sounds...
show waiting queue / onstagequeue members
add 'settings' panel to tweak the settings
better control of the z-axis... / 
Independent animation of members cast-shadows... Jump! ;-)

Source on Stakcblitz: https://stackblitz.com/edit/gameboard3d
❤ -> css patterns for clothing borrowed From Ana Tudor.

[Edit on StackBlitz ⚡️](https://stackblitz.com/edit/gameboard3d)
