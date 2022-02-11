import { game } from "./gameVariables.js"
import { memberAutoPilot } from "./members.js";
import { fillWaitingQueue } from "./helpers.js"
// import * as Audio from "./audio"

// import key from "keyboardjs";

import "./app.css"
import * as Audio from "./audio.js"
async function createBoard() {
   const game = await import("./gameVariables.js")
   return game
}

createBoard().then(() => {

   const gameStartEvent = () => {
      document.body.appendChild(game.board.element)
      fillWaitingQueue(game.waitingQueue, game.board.members)
      const gameStart = setInterval(() => {
      memberAutoPilot()

      if(game.onStageQueue.length > 0)
         Audio.playAudio(Audio.stepStart, 0.1)
      }, (game.timer / game.fps) * game.steps.max)

         // setTimeout(() => {
         // clearInterval(gameStart)}, 4000)
   }
   gameStartEvent()
})