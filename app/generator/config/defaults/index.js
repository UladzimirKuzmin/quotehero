import { DEFAULT_FONT_SIZE } from './constants';

export const defaults = {
  src: './images',
  dist: './dist',
  original: '',
  result: '',
  resize: true,
  crop: true,
  resizeOptions: {
    width: 1080,
    height: 1080,
  },
  drawShape: false,
  drawOptions: {
    shape: 'rectangle',
    coords: [],
    frameRatio: 1,
    fill: 'transparent',
    stroke: {
      color: 'transparent',
      size: 0,
    },
  },
  drawText: false,
  textOptions: {
    text: '',
    color: '#fff',
    font: {
      path: './fonts/KaushanScript-Regular.ttf',
      family: 'KaushanScript-Regular',
    },
    size: DEFAULT_FONT_SIZE,
    gravity: 'Center',
    offsets: {
      x: 100,
      y: 200,
    },
    stroke: {
      color: 'transparent',
      size: 0,
    },
  },
  drawCaption: false,
  captionOptions: {
    caption: '',
    color: '#fff',
    font: {
      path: './fonts/Pacifico-Regular.ttf',
      family: 'Pacigico-Regular',
    },
    size: DEFAULT_FONT_SIZE,
    gravity: 'South',
    offsets: {
      x: 100,
      y: 75,
    },
    stroke: {
      color: 'transparent',
      size: 0,
    },
  },
  effects: [],
  monochrome: false,
  callback: null,
};
