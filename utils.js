import path from 'path';
import { readdir, readFileSync } from 'fs';
import { promisify } from 'util';

const readDirAsync = promisify(readdir);

/**
 * Reads directory and obtains all images from it
 *
 * @param {string} src
 *
 * @returns {Array}
 */
export const getImages = async (src='./images') => {
  try {
    const images = await readDirAsync(src);
    return Promise.all(images.filter(image => path.extname(image) !== ''));
  } catch(err) {
    console.log(err);
  }
};

/**
 * Reads options data from json file
 *
 * @param {string} optionsFile
 * @param {string} folder
 *
 * @returns {Object}
 */
export const readOptions = (optionsFile = 'options', folder = '.' ) => {
  const folderPath = path.resolve(__dirname, folder);
  try {
    return JSON.parse(readFileSync(`${folderPath}/${optionsFile}.json`, { encoding: 'utf8' }));
  } catch (err) {
    console.log(err);
  }
};
