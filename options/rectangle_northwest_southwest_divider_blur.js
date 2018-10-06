export default [
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
];
