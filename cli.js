import path from 'path';
import { readdir } from 'fs';
import { promisify } from 'util';
import { argv } from 'yargs';
import Generator from './app/generator';
import options from './options';

const readDirAsync = promisify(readdir);

/**
 * Initializes generator
 *
 * @param {string} original
 * @param {number} index
 * @param {string} src
 * @param {string} dist
 *
 * @returns {Object}
 */
const initializeGenerator = (original, index=0, src='./images', dist='./dist') => {
  return new Generator(Object.assign({}, options[index], {
    id: `generator_${index + 1}`,
    original,
    src,
    dist,
    result: `image${index + 1}${path.extname(original)}`,
    cb: onImageGenerated,
  }));
}

const onImageGenerated = function(err) {
  if (err) return console.dir(arguments);
  console.log(this.outname + ' created  ::  ' + arguments[3]);
};

const getImages = async (src='./images') => {
  try {
    const images = await readDirAsync(src);
    return Promise.all(images.filter(image => path.extname(image) !== ''));
  } catch(err) {
    console.log(err);
    process.exit(1);
  }
};

export const generateQuote = async () => {
  try {
    const { filename, src, dist } = argv
    initializeGenerator(filename, undefined, src, dist).generate();
  } catch(err) {
    console.log(err);
  }
};

export const generateQuotes = async () => {
  try {
    const { src, dist } = argv
    const images = await getImages(src);
    images.forEach((image, index) => {
      initializeGenerator(image, index, src, dist).generate();
    });
  } catch(err) {
    console.log(err);
  };
};

argv.filename ? generateQuote() : generateQuotes();
