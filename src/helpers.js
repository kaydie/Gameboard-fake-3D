import { game } from "./gameVariables.js"
import * as members from "./members.js"

function createLayer(id){
    let layer
    if(document.getElementById(id) == null) {
        layer = document.createElement("div")
        layer.classList.add("layer")
        layer.setAttribute("id", id)
    } else {
        layer = document.getElementById(id)
    }
    return layer
}

function createGrid(element, rows, cols, min, max) {
    const nav = element.id == "nav" ? true : false

    if(nav){
    element.style.gridTemplateColumns = `repeat(${cols}, auto)`
    const nav = element.id == "nav" ? true : false
    for (let row = 1; row <= rows; row++) {
        for (let col = 1; col <= cols; col++) {
            const scale = max - ( (max - min) * ((rows - row + col) / 2) ) / cols
            const zIndex = (Math.pow(row,2) * rows) + (Math.pow(cols- col,2) * cols)
            const tile = createTile(row, col, zIndex, scale, nav)
            element.appendChild(tile)
       }
    }
}
    return element
}

function createTile(rowIndex, colIndex, zIndex, scale, addEvents = false){

    const tile = document.createElement("div")

    tile.classList.add("tile")

    tile.dataset.col = colIndex
    tile.dataset.row = rowIndex

    tile.style.transform = `scale(${scale})`
    tile.style.zIndex = zIndex

    if(addEvents)
    tile.addEventListener("click", (e) => {

        let currentMember = moveToOnStageQueue()

        if (currentMember === false)
            return false

        currentMember.location.currentTile = e.target

        let queueId = currentMember.anchor.dataset.queueId
        let scaleValue = e.target.style.transform.match(/scale\(([\d.]*).*\)/)
        currentMember.location.layer = getRandomLayer() ? getRandomLayer() : null

        currentMember.location.tile = {
            row: e.target.dataset.row,
            col: e.target.dataset.col,
        }

        members.placeMember(
            currentMember,
            scaleValue[1],
            "click"
        )
        members.placeMemberOnBoard(game.onStageQueue[queueId])

    }, false)

    tile.addEventListener("animationend", (e) =>
        e.target.classList.remove("footprint")
    )
    return tile
}

function getRandomLayer() {
const layers = Object.entries(game.board.layers)
const randomLayerId = layers[Math.ceil(Math.random(layers.length)*layers.length)-1]
const randomLayer = document.querySelector(`#${randomLayerId[0]}`)

if (randomLayer == null)
    return false

return randomLayer
}

function fillWaitingQueue(arr, num) {
    if(num == null)
        return false;

    for (let i = 1; i <= num; i++) {

        const newMember = members.fetchMemberData()
        if (newMember === false)
            return false

            arr.push(newMember)
    }
}

function moveToOnStageQueue(e) {

    // if(game.waitingQueue.length === 0)
    //     return false

    if (game.onStageQueue.length === game.board.members)
        return false

    let memberToMove = game.waitingQueue.pop()

    memberToMove.anchor.dataset.queueId = game.onStageQueue.push(memberToMove) - 1

    return memberToMove
}
export { createLayer, createGrid, createTile, fillWaitingQueue }
