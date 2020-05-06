import path from 'path';
import { argv } from 'yargs';

import Generator from './app/Generator';
import { readOptions, getImages } from './utils'

const { filename, src, dist, opts, text, caption } = argv;

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
const initializeGenerator = (
  original,
  src='./images',
  dist='./dist',
  optsFileName='options',
  index=0
) => {
  const options = readOptions(optsFileName);

  if (!options) {
    return console.log('Please, provide options.json file');
  }

  return new Generator({
    ...(
      Array.isArray(options.data)
        ? options.data[index]
        : {
          ...options.data, 
          ...(text && {
            textOptions: { ...options.data.textOptions, text },
          }),
          ...(caption && {
            captionOptions: { ...options.data.captionOptions, caption },
          }),
        }
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
 *
 * @param {string} filename
 * @param {string} src
 * @param {string} dist
 * @param {string} optsFileName
 */
export const generateQuote = async (filename, src, dist, optsFileName) => {
  try {
    const generator = initializeGenerator(filename, src, dist, optsFileName) || {};
    typeof generator.generate === 'function' && generator.generate();
  } catch(err) {
    console.log(err);
  }
};

/**
 * Generates a bunch of quote images
 * 
 * @param {string} src
 * @param {string} dist
 * @param {string} optsFileName
 */
export const generateQuotes = async (src, dist, optsFileName) => {
  try {
    const images = await getImages(src);
    images.forEach((image, index) => {
      const generator = initializeGenerator(image, src, dist, optsFileName, index) || {};
      typeof generator.generate === 'function' && generator.generate();
    });
  } catch(err) {
    console.log(err);
  };
};

export const start = () =>
  filename
    ? generateQuote(filename, src, dist, opts)
    : generateQuotes(src, dist, opts);

start();
