import path from 'path';

import Generator from './app/Generator';
import { readOptions, getImages } from './utils'

/**
 * Initializes generator
 *
 * @param {string} filename
 * @param {number} index
 * @param {string} src
 * @param {string} dist
 *
 * @returns {Object}
 */
const initializeGenerator = ({
  filename,
  text,
  caption,
  src='./images',
  dist='./dist',
  optsFileName='options',
  index=0
}) => {
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
    filename,
    src,
    dist,
    result: `image${index + 1}${path.extname(filename)}`,
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
 * @param {string} text
 * @param {string} caption
 * @param {string} src
 * @param {string} dist
 * @param {string} optsFileName
 */
export const generateQuote = (filename, text, caption, src, dist, optsFileName) => {
  try {
    const generator = initializeGenerator({ filename, text, caption, src, dist, optsFileName }) || {};
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
      const generator = initializeGenerator({ image, src, dist, optsFileName, index }) || {};
      typeof generator.generate === 'function' && generator.generate();
    });
  } catch(err) {
    console.log(err);
  };
};
