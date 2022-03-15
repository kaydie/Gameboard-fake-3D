import { createLayer, createGrid } from './helpers';

export const game = {};

Object.assign(game, {
  board: {
    element: document.createElement('div'),
    grid: {
      element: createLayer('grid'),
      cols: 20,
      rows: 20,
      gap: 0,
    },
    tile: {
      size: {
        min: 0,
        max: 1.5,
      },
    },
    layers: {
      ceiling: createLayer('ceiling'),
      floor: createLayer('floor'),
      attic: createLayer('attic'),
    },
  },
});

game.board.element.id = 'board';

const board = game.board.element;

const grid = createGrid(
  game.board.grid.element,
  game.board.grid.rows,
  game.board.grid.cols,
  game.board.tile.size.min,
  game.board.tile.size.max
);

Object.entries(game.board.layers).forEach(([key, value]) => {
  game.board.element.appendChild(value);
  value.style.zIndex =
    1 +
    Object.keys(game.board.layers).length -
    game.board.element.children.length;
  createGrid(
    value,
    game.board.grid.rows,
    game.board.grid.cols,
    game.board.tile.size.min,
    game.board.tile.size.max
  );
});

const nav = document.body.appendChild(document.createElement('div'));
nav.id = 'nav';
createGrid(
  nav,
  game.board.grid.rows,
  game.board.grid.cols,
  game.board.tile.size.min,
  game.board.tile.size.max
);

board.appendChild(grid);

Object.assign(game, {
  waitingQueue: [],
  onStageQueue: [],
  timer: 2000, //ms
  fps: 10, // this is per timer cycle
  steps: {
    min: 15,
    max: 15,
  },
  credits: {
    min: 10,
    max: 20,
  },
  members: {},
});

Object.assign(game.members, {
  neil: {
    bio: {
      name: 'Neil',
      born: null,
      from: 'Bristol',
      occupation: 'Student Peace Studies',
      about:
        'A Peace Studies student with characteristics that included him being a morose, pessimistic hippie with pacifist leanings. Neil often wound up having to do all the chores around the house, while the other three students barely acknowledged his presence unless they could blame him for something going wrong.',
    },
    quotes: [
      `I won’t say anything ’cause no one ever listens to me, anyway. I might as well be a Leonard Cohen album.`,
      `I heard that Rick.`,
      `Oh, upstairs. Just follow your nose.`,
      `Guys, there's some dinner on the floor if you want it`,
      `I just looked at it and it blew up !`,
      `Socks aren't vegetables, man, they should be wiped out !`,
      `Boom shanka...May the seed of your loins be fruitful in the belly of your woman.`,
    ],
    anatomy: {
      speechBubble: {
        children: [],
      },
      nose: {
        children: [],
      },
      glasses: {
        children: [],
      },
      head: {
        children: ['speechBubble', 'glasses', 'nose'],
      },
      startNumber: {
        children: [],
      },
      waist: {
        children: ['head', 'startNumber'],
      },
      shoes: {
        children: [],
      },
      legs: {
        children: ['shoes'],
      },
      pinlight: {
        children: [],
      },
      dropShadow: {
        children: [],
      },
      anchor: {
        children: ['pinlight', 'dropShadow', 'legs', 'waist'],
      },
    },
    location: {
      layer: 'floor',
      tile: {
        row: 1,
        col: 1,
      },
      transform: '',
      currentTile: document.querySelector(`[data-row="10"][data-col="10"]`),
    },
    keyBindings: [
      'up',
      'down',
      'left',
      'right',
      'up + left',
      'up + right',
      'down + left',
      'down + right',
    ],
  },
  maggie: {
    bio: {
      name: 'Maggie',
      born: null,
      from: 'Bristol',
      occupation: 'Student Peace Studies',
      about:
        'A Peace Studies student with characteristics that included him being a morose, pessimistic hippie with pacifist leanings. Neil often wound up having to do all the chores around the house, while the other three students barely acknowledged his presence unless they could blame him for something going wrong.',
    },
    quotes: [
      `I won’t say anything ’cause no one ever listens to me, anyway. I might as well be a Leonard Cohen album.`,
      `I heard that Rick.`,
      `Oh, upstairs. Just follow your nose.`,
      `Guys, there's some dinner on the floor if you want it`,
      `I just looked at it and it blew up !`,
      `Socks aren't vegetables, man, they should be wiped out !`,
      `Boom shanka...May the seed of your loins be fruitful in the belly of your woman.`,
    ],
    anatomy: {
      speechBubble: {},
      maggie_nose: {},
      maggie_glasses: {},
      maggie_mouth: {},

      maggie_head: {
        children: [
          'speechBubble',
          'maggie_glasses',
          'maggie_nose',
          'maggie_mouth',
        ],
      },

      startNumber: {},
      maggie_clevage: {},
      maggie_boobs: {},

      maggie_waist: {
        children: [
          'maggie_boobs',
          'maggie_clevage',
          'maggie_head',
          'startNumber',
        ],
      },

      maggie_shoes: {},
      maggie_legs: {
        children: ['maggie_shoes'],
      },

      pinlight: {},
      dropShadow: {},
      maggie_skirt: {},

      anchor: {
        children: [
          'maggie_legs',
          'maggie_waist',
          'maggie_skirt',
          'pinlight',
          'dropShadow',
          'test',
        ],
      },
    },
    location: {
      layer: null,
      tile: {
        row: 1,
        col: 1,
      },
      transform: '',
      currentTile: null,
    },
    keyBindings: [
      'up',
      'down',
      'left',
      'right',
      'up + left',
      'up + right',
      'down + left',
      'down + right',
    ],
  },
  tree: {
    bio: {
      name: 'Tree',
      born: null,
      from: 'Mother Earth',
      occupation: 'Biologist',
      about: 'Just a tree.',
    },
    quotes: [`Hey, I'm Just a Tree`],
    anatomy: {
      speechBubble: {
        children: [],
      },
      startNumber: {},

      tree_waist: {
        children: ['startNumber'],
      },
      pinlight: {},
      dropShadow: {},

      anchor: {
        children: ['tree_waist', 'pinlight', 'dropShadow'],
      },
    },
    location: {
      layer: null,
      tile: {
        row: 1,
        col: 1,
      },
      transform: '',
      currentTile: null,
    },
    keyBindings: ['up', 'down', 'left', 'right'],
  },
});

Object.assign(game.board, {
  members: 15,
});
