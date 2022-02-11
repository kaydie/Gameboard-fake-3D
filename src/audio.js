const url = "https://kaydies.nl/sounds/",
dir = ["Samples/","WAV/"],
ext = ".mp4",
hitSounds = [
    `clap-fat`,
    `hihat-ring`,
    `kick-softy`,
    `perc-hollow`,
    `tom-short`,
],
scapeSounds = [
    `Braam - Zone End`,
    `Impact - Low Blow`,
    `Short - Mini Popup`,
    `Short - Ploppy Plop`,
    `Short - Sad Little Sonar`,
    `Swish - Shortnoise`,
    `Texture - Goblet Of Wisdom`,
]
function cacheAudio(src){
    let el = document.createElement("audio")
    el.preload = "auto"
    el.src = src
    document.body.appendChild(el)
    return el
}

function playAudio(el, volume=0.2) {
    el = new Audio(el.getAttribute("src"))
    el.currentTime = 0;
    el.volume = volume
    el.play()
}

    const bump = cacheAudio(`${[url,dir[0],`perc-hollow`,ext].join("")}`,1);
    const step = cacheAudio(`${[url,dir[0],`kick-softy`,ext].join("")}`,.5);
    const hover = cacheAudio(`${[url,dir[0],`tom-short`,ext].join("")}`,1);
    const hit = cacheAudio(`${[url,dir[1],`Short - Ploppy Plop`,ext].join("")}`,1)
    const gameStartAudio = cacheAudio(`${[url,dir[1],`Swish - Shortnoise`,ext].join("")}`,1)
    const stepStart = cacheAudio(`${[url,dir[1],`Short - Sad Little Sonar`,ext].join("")}`,0.2)

    stepStart.volume = 1
    step.volume = 0.5

export { bump, hit, gameStartAudio, hover, step, playAudio, stepStart }