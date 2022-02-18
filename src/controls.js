import keyboardJS from 'keyboardjs';

let theCounter = 0;

function memberManualControlSetup(member, steps) {
  const controlled = member['anchor'].classList.contains('autopilotDisabled');

  keyboardJS.reset();

  if (controlled === false) {
    console.log('key bindings cleared');
    // keyboardJS.reset();
    return false;
  }

  console.log(
    `adding key bindings (${member.keyBindings.join(', ')}) for ${
      member.bio.name
    } from ${member.bio.from}`
  );
  if (member.keyBindings != null)
    member.keyBindings.forEach((key) => {
      keyboardJS.bind(key, (e) => {
        e.preventDefault;
        console.log(`${member.bio.name} is going ${key}`);
        if (steps > member.doSteps.length)
          member.doSteps.push(`${key}`);
        console.log(member);
      });
    });
}

export { memberManualControlSetup };
