import keyboardJS from 'keyboardjs'
import { game } from "./gameVariables.js"

function memberManualControlSetup(member) {

    const controlled = member["anchor"].classList.contains("autopilotDisabled")

    if(controlled === false){
        console.log("key bindings cleared")
        keyboardJS.reset();
        return false;
    }

    console.log(`adding key bindings (${member.keyBindings.join(", ")}) for ${member.bio.name} from ${member.bio.from}`)
    if(member.keyBindings != null)
        member.keyBindings.forEach(key => {
            keyboardJS.bind(key, (e) => {
                e.preventDefault
                console.log(`${member.bio.name} is going ${key}` )
            })
        })
}

export { memberManualControlSetup }