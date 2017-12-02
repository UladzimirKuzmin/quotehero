import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import Generator from './app/generator';

const config = dotenv.config().parsed;

const callback = function(err) {
  if (err) return console.dir(arguments);
  console.log(this.outname + " created  ::  " + arguments[3]);
};

const files = fs.readdirSync(`${__dirname}/images`).filter(file => {
  return path.extname(file) !== '';
});

// files.forEach(async (file, index) => {
  new Generator({
    original: files[2],
    result: `image${2}${path.extname(files[2])}`,
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
        path: './fonts/Aladin-Regular.ttf',
        family: 'Aladin-Regular',
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
      gravity: 'South',
      caption: 'Rachel McAdams',
    },
    drawDivider: true,
    effects: [{
      blur: {radius: 2, sigma: 1},
    }],
    cb: callback,
  }).generate();
// });
