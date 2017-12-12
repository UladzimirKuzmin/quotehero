export default [
  {
    drawShape: true,
    drawOptions: {
      shape: 'rectangle',
      frameRatio: 0.075,
      stroke: {
        color: '#fff',
        size: 2,
      },
    },
    drawText: true,
    textOptions: {
      font: {
        path: './fonts/Pacifico-Regular.ttf',
        family: 'Pacifico-Regular',
      },
      gravity: 'Center',
      text: 'Everybody sooner or later has to drop the luggage and the baggage of illusions.',
    },
    drawCaption: true,
    captionOptions: {
      size: 40,
      font: {
        path: './fonts/Pacifico-Regular.ttf',
        family: 'Pacifico-Regular',
      },
      gravity: 'South',
      caption: 'Carlos Santans',
    },
    effects: [{
      blur: {radius: 2, sigma: 1},
    }],
  },
  {
    drawShape: true,
    drawOptions: {
      shape: 'rectangle',
      frameRatio: 0.05,
      fill: '#00000077',
    },
    drawText: true,
    textOptions: {
      font: {
        path: './fonts/Sail-Regular.ttf',
        family: 'Sail-Regular',
        offsets: {
          x: 100,
          y: 150,
        },
      },
      gravity: 'NorthEast',
      text: 'Did you ever notice that the first piece of luggage on the carousel never belongs to anyone?',
    },
    drawCaption: true,
    captionOptions: {
      size: 60,
      font: {
        path: './fonts/Qwigley-Regular.ttf',
        family: 'Qwigley-Regular',
      },
      gravity: 'SouthEast',
      caption: 'Erma Bombeck',
      offsets: {
        x: 100,
        y: 150,
      },
    },
    drawDivider: true,
    effects: [{
      blur: {radius: 2, sigma: 1},
    }],
  },
  {
    drawShape: true,
    drawOptions: {
      shape: 'rectangle',
      frameRatio: 0.075,
      fill: '#00000066',
    },
    drawText: true,
    textOptions: {
      font: {
        path: './fonts/Arizonia-Regular.ttf',
        family: 'Arizonia-Regular',
      },
      gravity: 'NorthWest',
      text: 'Running through airports with pounds of luggage - that\'s a good workout.',
    },
    drawCaption: true,
    captionOptions: {
      size: 60,
      font: {
        path: './fonts/Qwigley-Regular.ttf',
        family: 'Qwigley-Regular',
      },
      gravity: 'SouthWest',
      caption: 'Rachel McAdams',
    },
    drawDivider: true,
    effects: [{
      blur: {radius: 2, sigma: 1},
    }],
  },
  {
    drawShape: true,
    drawOptions: {
      shape: 'rectangle',
      frameRatio: 0.075,
      fill: '#00000088',
    },
    drawText: true,
    textOptions: {
      font: {
        path: './fonts/Kavoon-Regular.ttf',
        family: 'Kavoon-Regular',
      },
      gravity: 'Center',
      text: 'Don\'t let your luggage define your travels, each life unravels differently.',
    },
    drawCaption: true,
    captionOptions: {
      size: 40,
      font: {
        path: './fonts/CevicheOne-Regular.ttf',
        family: 'CevicheOne-Regular',
      },
      gravity: 'South',
      caption: 'Shane L. Koyczan',
    },
  }
];
