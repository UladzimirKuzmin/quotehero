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
  return Promise.all(images.filter(file => path.extname(file) !== ''));
};

(async () => {
  try {
    const files = await getImages();
    files.forEach((file, index) => {
      ((file, index) => {
        new Generator(Object.assign({}, options[index], {
          id: `generator_${index + 1}`,
          original: file,
          result: `image${index}${path.extname(file)}`,
          cb: callback,
        })).generate();
      })(file, index);
    });
  } catch (err) {
    console.log(err);
  };
})();
