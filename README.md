# Quotehero

Picture quotes generator

## Installation
Clone the repo and install the dependencies. Due to generator uses node-canvas library and to make all work fine some additional instruments are required. See https://github.com/Automattic/node-canvas#compiling and http://www.graphicsmagick.org/README.html#installation

Node version needs to be higher than 10. 

Using npm:

```
npm i
```

Using yarn:

```
yarn
```

## Usage example:

### Cli:

To generate one file:

```
yarn start --filename=image.jpg --text=text --caption=caption
```
To generate any picture you need to pass options.json file and original image filename with exstension. See options.json.example as a reference.

Default folder with images is './images'. Default destination folder is './dist'. Default options filename is 'options'.
```
yarn start --filename=image.jpg --text=text --caption=caption --src=src --dist=dist --opts=options
```

To generate a bunch of files in one run:

```
yarn start --opts=options
```

## In code

Let's consider generating of one picture:

```
import { generateQuote } from './cli';

generateQuote('image.jpg', 'Some text for quote', 'Quote caption');
```
Where first argument is a filename of the background image, second is the main text and the third is caption if it's needed.
Default folder with images is './images'. Default destination folder is './dist'. Default options filename is 'options'.
