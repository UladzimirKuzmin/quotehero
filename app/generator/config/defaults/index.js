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
      path: './fonts/Pacifico-Regular.ttf',
      family: 'Pacifico-Regular',
    },
    size: DEFAULT_FONT_SIZE,
    gravity: 'NorthWest',
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
      path: './fonts/BadScript-Regular.ttf',
      family: 'BadScript-Regular',
    },
    size: DEFAULT_FONT_SIZE,
    gravity: 'SouthEast',
    offsets: {
      x: 100,
      y: 100,
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
