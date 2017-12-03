export default [
  {
    resizeOptions: {
      width: 1080,
      height: 1080,
    },
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
      gravity: 'NorthEast',
      text: 'Everybody sooner or later has to drop the luggage and the baggage of illusions.',
    },
    drawCaption: true,
    captionOptions: {
      size: 60,
      font: {
        path: './fonts/Pacifico-Regular.ttf',
        family: 'Pacifico-Regular',
      },
      gravity: 'SouthEast',
      caption: 'Carlos Santans',
    },
    drawDivider: true,
    effects: [{
      blur: {radius: 2, sigma: 1},
    }],
  },
  {
    resizeOptions: {
      width: 1080,
      height: 1080,
    },
    drawShape: true,
    drawOptions: {
      shape: 'rectangle',
      frameRatio: 0.075,
      fill: '#00000066',
    },
    drawText: true,
    textOptions: {
      font: {
        path: './fonts/Akronim-Regular.ttf',
        family: 'Akronim-Regular',
      },
      gravity: 'Center',
      text: 'Did you ever notice that the first piece of luggage on the carousel never belongs to anyone?',
    },
    drawCaption: true,
    captionOptions: {
      size: 60,
      font: {
        path: './fonts/Qwigley-Regular.ttf',
        family: 'Qwigley-Regular',
      },
      gravity: 'South',
      caption: 'Erma Bombeck',
    },
    drawDivider: true,
    effects: [{
      blur: {radius: 2, sigma: 1},
    }],
  },
  {
    resizeOptions: {
      width: 1080,
      height: 1080,
    },
    drawShape: true,
    drawOptions: {
      shape: 'rectangle',
      frameRatio: 0.075,
      fill: '#00000066',
    },
    drawText: true,
    textOptions: {
      font: {
        path: './fonts/BungeeShade-Regular.ttf',
        family: 'BungeeShade-Regular',
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
  }
];
