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
        path: './fonts/SedgwickAveDisplay-Regular.ttf',
        family: 'SedgwickAveDisplay-Regular-Regular',
      },
      gravity: 'NorthEast',
      text: 'Whatever short test text',
    },
    drawCaption: true,
    captionOptions: {
      size: 60,
      font: {
        path: './fonts/Qwigley-Regular.ttf',
        family: 'Qwigley-Regular',
      },
      gravity: 'SouthEast',
      caption: 'Test author 1',
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
        path: './fonts/SedgwickAveDisplay-Regular.ttf',
        family: 'SedgwickAveDisplay-Regular-Regular',
      },
      gravity: 'Center',
      text: 'One more whatever short test text with dot in the end.',
    },
    drawCaption: true,
    captionOptions: {
      size: 60,
      font: {
        path: './fonts/Qwigley-Regular.ttf',
        family: 'Qwigley-Regular',
      },
      gravity: 'South',
      caption: 'Test author 2',
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
        path: './fonts/SedgwickAveDisplay-Regular.ttf',
        family: 'SedgwickAveDisplay-Regular-Regular',
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
