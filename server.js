import dotenv from 'dotenv';
import Generator from './app/generator';

const config = dotenv.config().parsed;

const callback = function(err) {
  if (err) return console.dir(arguments);
  console.log(this.outname + " created  ::  " + arguments[3]);
};

const fileName = 'kayne-james-314023.jpg';
const generator = new Generator({
  original: fileName,
  result: 'image.png',
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
    size: 50,
    text: 'Everybody sooner or later has to drop the luggage and the baggage of illusions.',
  },
  drawCaption: true,
  captionOptions: {
    size: 30,
    caption: 'Carlos Santana',
  },
  effects: [{
    blur: {radius: 8, sigma: 4},
  }],
  cb: callback,
});

generator.generate();
