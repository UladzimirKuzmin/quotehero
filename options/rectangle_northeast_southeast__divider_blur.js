export default [
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
];
