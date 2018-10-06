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
];
