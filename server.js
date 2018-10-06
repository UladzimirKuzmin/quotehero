import path from 'path';
import { readdir } from 'fs';
import { promisify } from 'util';
import { argv } from 'yargs';
import Generator from './app/generator';
import options from './options';

const readdirAsync = promisify(readdir);

const onImageGenerated = function(err) {
  if (err) return console.dir(arguments);
  console.log(this.outname + " created  ::  " + arguments[3]);
};

const getImages = async () => {
	try {
		const images = await readdirAsync(argv.src);
		return Promise.all(images.filter(image => path.extname(image) !== ''));
	} catch(err) {
    console.log(err);
    process.exit();
	}
};

const generateQuotes = async () => {
	try {
    const images = await getImages();
    images.forEach((image, index) => {
      new Generator(Object.assign({}, options[index], {
				id: `generator_${index + 1}`,
				original: image,
				result: `image${index}${path.extname(image)}`,
				cb: onImageGenerated,
			})).generate();
    });
  } catch (err) {
    console.log(err);
  };
};

generateQuotes();
