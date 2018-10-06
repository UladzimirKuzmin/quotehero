import path from 'path';
import { readdir } from 'fs';
import { promisify } from 'util';
import Generator from './app/generator';
import options from './options';

const readdirAsync = promisify(readdir);

const callback = function(err) {
  if (err) return console.dir(arguments);
  console.log(this.outname + " created  ::  " + arguments[3]);
};

const getImages = async () => {
  const images = await readdirAsync(`${__dirname}/images`);
  return Promise.all(images.filter(image => path.extname(image) !== ''));
};

(async () => {
  try {
    const images = await getImages();
    images.forEach((image, index) => {
      ((image, index) => {
        new Generator(Object.assign({}, options[index], {
          id: `generator_${index + 1}`,
          original: image,
          result: `image${index}${path.extname(image)}`,
          cb: callback,
        })).generate();
      })(image, index);
    });
  } catch (err) {
    console.log(err);
  };
})();
