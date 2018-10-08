import path from 'path';
import { readdir } from 'fs';
import { promisify } from 'util';
import { argv } from 'yargs';
import Generator from './app/generator';
import options from './options';

const readDirAsync = promisify(readdir);

const errorHandler = err => {
  console.log(err);
  process.exit(1);
}

const initializeGenerator = (image, index=0) => {
  return new Generator(Object.assign({}, options[index], {
    id: `generator_${index + 1}`,
    original: image,
    result: `image${index + 1}${path.extname(image)}`,
    cb: onImageGenerated,
  }));
}

const onImageGenerated = function(err) {
  if (err) return console.dir(arguments);
  console.log(this.outname + " created  ::  " + arguments[3]);
};

const getImages = async () => {
	try {
    const images = await readDirAsync(argv.src);
		return Promise.all(images.filter(image => path.extname(image) !== ''));
	} catch(err) {
    errorHandler(err);
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
    const images = await getImages();
    images.forEach((image, index) => {
      initializeGenerator(image, index).generate();
    });
  } catch(err) {
    console.log(err);
  };
};

argv.filename ? generateQuote() : generateQuotes();