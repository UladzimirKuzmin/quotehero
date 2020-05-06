import path from 'path';
import { argv } from 'yargs';

import Generator from './app/generator';
import { readOptions, getImages } from './utils'
import { isArray } from 'util';

const { filename, src, dist } = argv;

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
  const options = readOptions();

  if (!options) {
    return console.log('Please, provide options.json file');
  }

  return new Generator({
    ...(
      Array.isArray(options.data)
        ? options.data[index]
        : options.data
    ),
    id: `generator_${index + 1}`,
    original,
    src,
    dist,
    result: `image${index + 1}${path.extname(original)}`,
    cb: function(err) {
      if (err) return console.dir(arguments);
      console.log(this.outname + ' created  ::  ' + arguments[3]);
    },
  });
}

/**
 * Generates one quote image
 */
export const generateQuote = async () => {
  try {
    const generator = initializeGenerator(filename, undefined, src, dist) || {};
    typeof generator.generate === 'function' && generator.generate()
  } catch(err) {
    console.log(err);
  }
};

/**
 * Generates a bunch of quote images
 */
export const generateQuotes = async () => {
  try {
    const images = await getImages(src);
    images.forEach((image, index) => {
      const generator = initializeGenerator(image, index, src, dist) || {};
      typeof generator.generate === 'function' && generator.generate()
    });
  } catch(err) {
    console.log(err);
  };
};

export const start = () => filename ? generateQuote() : generateQuotes();

start();
