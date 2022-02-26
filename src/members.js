import { game } from './gameVariables.js';
import { memberManualControlSetup } from './controls.js';
import * as Audio from './audio';

let iterationCount;

let logs = {
  animate: false,
};

function fetchMemberData(name = 'random') {
  const memberList = Object.values(game.members);

  if (memberList[name] == undefined && name !== 'random') return false;

  if (name === 'random')
    name = Math.ceil(Math.random() * memberList.length) - 1;

  let newMemberData = JSON.parse(JSON.stringify(memberList[name]));
  newMemberData.bio.born = btoa(Math.ceil(Math.random() * Date.now()));
  newMemberData.doSteps = [];

  return buildMember(newMemberData);
}

function buildMember(memberData) {
  const member = {};

  // memberData.location = placeMember()

  for (let [key, memberItem] of Object.entries(memberData.anatomy)) {
    member[key] = addMemberElement(key);

    if (memberItem.children == undefined) continue;

    memberItem.children.forEach((childItem) => {
      if (member[childItem] != undefined)
        member[key].appendChild(member[childItem]);
    });
  }

  member.credits = Math.ceil(
    Math.random() * (game.credits.max - game.credits.min) + game.credits.min
  );
  member.quotes = memberData.quotes;
  member.bio = memberData.bio;
  member.doSteps = memberData.doSteps;
  member.location = memberData.location;
  member.keyBindings = memberData.keyBindings;

  return member;
}

function addMemberElement(name) {
  const element = document.createElement('div');
  element.classList.add(name);

  if (['head', 'maggie_head'].includes(name)) {
    element.addEventListener('click', (e) => {
      e.currentTarget.classList.add('shake');
    });
    element.addEventListener('animationend', (e) => {
      e.currentTarget.classList.remove('shake');
      e.currentTarget.classList.remove('shake-walk');
    });
  }

  if (['anchor'].includes(name)) {
  }
  return element;
}

function placeMemberOnBoard(layer, member, startTile, steps) {
  if (member == null) return;

  const anchor = member.anchor;
  // Object.assign(member.anchor.style, member.location.tile.moves)
  Audio.playAudio(Audio.hit);

  layer.appendChild(anchor);

  const hoverSound = function () {
    this.classList.add('autopilotDisabled');
    const clickedMember = game.onStageQueue[this.dataset.queueId];
    memberManualControlSetup(clickedMember, game.steps.max);
    this.removeEventListener('mouseenter', hoverSound, true);
    Audio.playAudio(Audio.hover);
    this.addEventListener('mouseleave', leaveSound);
  };

  const leaveSound = function (e) {
    if (e.currentTarget.classList.contains('hold') === false)
      e.currentTarget.classList.remove('autopilotDisabled');
    const clickedMember = game.onStageQueue[e.currentTarget.dataset.queueId];
    if (e.currentTarget.classList.contains('hold') === false)
      memberManualControlSetup(clickedMember);
    e.currentTarget.addEventListener('mouseenter', hoverSound, true);
  };

  anchor.addEventListener('mouseenter', hoverSound, true);

  anchor.addEventListener(
    'click',
    (e) => {
      Audio.playAudio(Audio.bump);
      e.currentTarget.classList.toggle('hold');
      const clickedMember = game.onStageQueue[e.currentTarget.dataset.queueId];
      if (e.currentTarget.classList.contains('hold') === false)
        memberManualControlSetup(clickedMember);

      if (e.currentTarget.querySelector('.head, .maggie_head') != null) {
        e.currentTarget.addEventListener('animationstart', (e) => {});
      }
      e.currentTarget
        .querySelector('.head, .maggie_head')
        .addEventListener('animationstart', (e) => {
          e.currentTarget.classList.remove('shake-walk');
        });
    },
    true
  );
}

function placeMember(member, scale, from = '-') {
  member.location.tile.row == null
    ? Math.ceil(Math.random() * game.board.grid.rows)
    : parseInt(member.location.tile.row);
  member.location.tile.col
    ? Math.ceil(Math.random() * game.board.grid.cols)
    : parseInt(member.location.tile.col);

  const tileData = getGridTileData(
    member.location.layer,
    member.location.tile.row,
    member.location.tile.col
  );
  const transformBase = 'skewX(-52deg) skewY(15deg) scaleX(100%) scaleY(125%)';

  let left = getAxisPositionInLayer(
    member.location.layer.clientWidth,
    tileData.posX,
    tileData.width,
    tileData.gapWith
  );
  let top = getAxisPositionInLayer(
    member.location.layer.clientHeight,
    tileData.posY,
    tileData.height,
    tileData.gapHeight
  );

  member.location.tile = {
    row: member.location.tile.row,
    col: member.location.tile.col,
  };
  return {
    moves: {
      left: `${left}px`,
      top: `${top}px`,
      transform: `${transformBase} scale(${scale})`,
    },
  };
}

function getGridTileData(
  layer,
  row,
  col,
  rows = game.board.grid.rows,
  cols = game.board.grid.cols,
  gap = game.board.grid.gap
) {
  return {
    width: layer.clientWidth / rows,
    height: layer.clientHeight / cols,
    posX: game.board.grid.cols - col,
    posY: game.board.grid.rows - row,
    gapWith: ((layer.clientWidth / 100) * gap) / rows,
    gapHeight: ((layer.clientHeight / 100) * gap) / cols,
  };
}

function getAxisPositionInLayer(layerValue, axisValue, tileValue, gapValue) {
  return Math.ceil(
    layerValue - (tileValue * axisValue + tileValue / 2 - gapValue)
  );
}

function memberAutoPilot(nextStep = null) {
  if (game.onStageQueue.length !== game.board.members) {
  }

  for (const [index, member] of game.onStageQueue.entries()) {
    let move = [];
    let steps = Math.round(Math.random() * game.steps.max);
    let manualStep = null;
    console.log('hi!');

    const autopilotDisabled =
      member.anchor.classList.contains('autopilotDisabled');

    if (autopilotDisabled) {
      member.speechBubble.style.visibility = 'visible';
      member.speechBubble.innerHTML = `<p>Not going anywere soon...<p>`;

      if (member.doSteps.length === 0) continue;

      manualStep = member.doSteps.pop();

      console.log(manualStep);
    } else {
      if (member == undefined) return clearTimeout(gameStart);
    }

    for (let step = 0; step < steps; step++) {
      let scale = {};

      member.startNumber.innerHTML = steps;

      if (member.location.currentTile == null)
        member.location.currentTile = document.querySelector(
          `[data-row="${member.location.tile.row}"][data-col="${member.location.tile.col}"]`
        );

      let startTile = member.location.currentTile;
      let nextStepX, nextStepY, consideredTile;

      // switch (nextStep) {
      //   case 'up':
      //     nextStepX = member.location.tile.row + 1
      //     nextStepY = member.location.tile.col
      //     break;
      //   case 'down':
      //     nextStepX = member.location.tile.row - 1
      //     nextStepY = member.location.tile.col
      //     break;
      //   case 'left':
      //     nextStepX = member.location.tile.row
      //     nextStepY = member.location.tile.col - 1
      //   case 'right':
      //     consideredTile
      //     nextStepX = member.location.tile.row
      //     nextStepY = member.location.tile.col + 1
      //     break;
      //   case 'up + left':
      //     nextStepX = member.location.tile.row + 1
      //     nextStepY = member.location.tile.col - 1
      //     break;
      //   case 'up + right':
      //     nextStepX = member.location.tile.row + 1
      //     nextStepY = member.location.tile.col + 1
      //     break;
      //   case 'down + left':
      //     nextStepX = member.location.tile.row - 1
      //     nextStepY = member.location.tile.col - 1
      //     break;
      //   case 'down + right':
      //     nextStepX = member.location.tile.row - 1
      //     nextStepY = member.location.tile.col + 1
      //   default:
      //     nextStepX = member.location.tile.row
      //     nextStepY = member.location.tile.col
      // }

      // consideredTile = document.querySelector(
      //   `[data-row="${nextStepX}"][data-col="${nextStepY}"]`
      // );

      console.log('ct', consideredTile);

      do {
        nextStepX =
          nextStepX == null
            ? parseInt(member.location.tile.row) +
              (Math.round(Math.random() * 2) - 1)
            : nextStepX;
        nextStepY =
          nextStepY == null
            ? parseInt(member.location.tile.col) +
              (Math.round(Math.random() * 2) - 1)
            : nextStepY;

        if (nextStepX > game.board.grid.rows) nextStepX = game.board.grid.rows;

        if (nextStepX < 1) nextStepX = 1;

        if (nextStepY > game.board.grid.cols) nextStepY = game.board.grid.cols;

        if (nextStepY < 1) nextStepY = 1;

        consideredTile = document.querySelector(
          `[data-row="${nextStepX}"][data-col="${nextStepY}"]`
        );
      } while (consideredTile === startTile);

      if (consideredTile == null) {
        consideredTile = startTile;
      }

      if (
        consideredTile.classList.contains('footprint') &&
        consideredTile !== startTile
      ) {
        member.speechBubble.style.visibility = 'visible';
        member.speechBubble.innerHTML = `<p>The spot is taken...<p>`;
        consideredTile.classList.remove('footprint');
        // continue
      }

      // consideredTile.classList.add("footprint")
      // startTile.classList.remove("footprint")
      let previousTile = startTile;

      let firstStep = move[0];

      if (
        (member.location.tile.row === nextStepX) &
        (member.location.tile.col === nextStepY) &
        false
      ) {
        consideredTile.style.outline = '5px solid orange';
        member.speechBubble.style.visibility = 'visible';
        member.speechBubble.innerHTML = `<p>Not going anywere...<p>`;
        continue;
      } else {
        if (member.speechBubble.innerHTML.length > 0) {
          if (member.speechBubble.innerHTML === `<p>The spot is taken...<p>`) {
            member.speechBubble.style.visibility = 'hidden';
            member.speechBubble.innerHTML = '';
          } else {
            member.speechBubble.style.visibility = 'hidden';
          }
        }

        scale.start = startTile.style.transform.match(/scale\(([\d.]*).*\)/);

        const moveStart = placeMember(member, scale.start[1]);
        move.push(moveStart);

        consideredTile.classList.add('footprint');

        member.location.currentTile = consideredTile;

        logs.animate && console.log('start step', moveStart);

        member.location.tile.row = nextStepX;
        member.location.tile.col = nextStepY;

        scale.end = consideredTile.style.transform.match(/scale\(([\d.]*).*\)/);
        const moveEnd = placeMember(member, scale.end[1]);
        move.push(moveEnd);

        const speak = Math.floor(Math.random() * 50);

        if (member.showBubble == undefined) member.showBubble = 0;

        if (member.speechBubble.innerHTML === '') {
          member.speechBubble.style.visibility = 'hidden';
        }
        if (speak < member.quotes.length) {
          member.speechBubble.innerHTML = `<p>${member.quotes[speak]}<p>`;
          member.speechBubble.style.visibility = 'visible';
        }

        if (member.showBubble > 20) {
          member.showBubble = 0;
          member.speechBubble.innerHTML === '';
          member.speechBubble.style.visibility = 'hidden';
        } else {
          member.showBubble++;
        }
        consideredTile.style.outline = '5px solid orange';
        consideredTile.style.outline = '0 none';

        startTile = consideredTile;

        let moveSteps = move.map((move) => move.moves);
        if (member.location.layer.contains(member.anchor) === false) {
          Object.assign(member.anchor.style, moveSteps[0].moves);

          placeMemberOnBoard(member.location.layer, member, startTile);

          if (member.credits === 1) {
            member.speechBubble.style.visibility = 'visible';
            member.speechBubble.innerHTML = `<p>Need... to... rest... beye!<p>`;
          }
        }

        if (moveSteps.length / 2 === steps) {
          if (
            parseFloat(moveSteps[0].top) <
            parseFloat(moveSteps[moveSteps.length - 1].top)
          )
            member.anchor.classList.remove('back');
          else member.anchor.classList.add('back');

          if (
            parseFloat(moveSteps[0].left) <
            parseFloat(moveSteps[moveSteps.length - 1].left)
          ) {
            member.anchor.classList.remove('right');
            member.anchor.classList.add('left');
          } else {
            member.anchor.classList.add('right');
            member.anchor.classList.remove('left');
          }

          if (member.maggie_waist != null) {
            member.maggie_waist.classList.add('waist-walk');
          }
          if (member.waist != null) {
            member.waist.classList.add('waist-walk');
          }
          if (member.maggie_skirt != null) {
            member.maggie_skirt.classList.add('skirt-walk');
          }

          if (member.maggie_legs != null) {
            member.maggie_legs.classList.add('waist-walk');
          }
          if (member.legs != null) {
            member.legs.classList.add('waist-walk');
          }

          const animateOptions = {
            duration: (game.timer / game.fps) * steps,
            iterations: 1,
            fill: 'forwards',
          };

          let move = member.anchor.animate(moveSteps, animateOptions);

          move.onfinish = (e) => {
            const target = e.target.effect.target;
            target
              .querySelectorAll(
                '.waist, .maggie_waist, .legs, .maggie_legs, .maggie_skirt'
              )
              .forEach((el) => {
                el.classList.remove('waist-walk');
                el.classList.remove('skirt-walk');
                el.classList.remove('legs-walk');
              });
            target.classList.remove('back');
            consideredTile.style.outline = null;
            if (member.credits !== 0) member.credits--;
          };
          move.pause();

          member.anchor.style.opacity = 0;
          member.anchor.style.zIndex = consideredTile.style.zIndex;

          logs.animate && console.log('move steps', moveSteps);

          let audioWalkSound = setTimeout(() => {
            if (move.playState === 'finished') {
            } else {
              // console.log(move.playState)
            }
          }, game.timer);
          move.ready.then(() => {});

          (async () => {
            move.play();
            console.log(
              'gbmr',
              move,
              game.onStageQueue[0].anchor.style.animationPlayState
            );
            let wait = sleep((game.timer / game.fps) * steps);
            let timer;
            timer = setInterval(() => {
              Audio.playAudio(Audio.step);
              wait.then(() => {
                clearInterval(timer);
                wait = null;
              });
            }, game.timer / game.fps + game.timer / game.fps / steps);
          })();
        }
      }
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export {
  placeMemberOnBoard,
  fetchMemberData,
  buildMember,
  placeMember,
  memberAutoPilot,
};
