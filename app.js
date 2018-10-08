import path from 'path';
import { readdir } from 'fs';
import { promisify } from 'util';
import { argv } from 'yargs';
import Generator from './app/generator';
import options from './options';

const readDirAsync = promisify(readdir);

const initializeGenerator = (image, index=0, src='./images') => {
  return new Generator(Object.assign({}, options[index], {
    id: `generator_${index + 1}`,
    src: src,
    original: image,
    result: `image${index + 1}${path.extname(image)}`,
    cb: onImageGenerated,
  }));
}

const onImageGenerated = function(err) {
  if (err) return console.dir(arguments);
  console.log(this.outname + " created  ::  " + arguments[3]);
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

const generateQuote = async () => {
  try {
    initializeGenerator(argv.filename).generate();
  } catch(err) {
    console.log(err);
  }
};

const generateQuotes = async () => {
	try {
    const images = await getImages(argv.src);
    images.forEach((image, index) => {
      initializeGenerator(image, index, argv.src).generate();
    });
  } catch(err) {
    console.log(err);
  };
};

argv.filename ? generateQuote() : generateQuotes();
