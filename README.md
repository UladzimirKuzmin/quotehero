# Quotehero

Picture quotes generator

## Installation
Clone the repo and install the dependencies. Due to generator uses node-canvas library and to make all work fine some additional instruments is required. See https://github.com/Automattic/node-canvas#compiling

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
yarn start --filename=image.jpg --opts=options
```
To generate any picture you need to pass options.json file and original image filename with exstension. See options.json.example as a reference.

Default folder with images is './images'. Default destionation folder is './dist'.
```
yarn start --filename=image.jpg --src=otherFolderWithImages --dist=buildFoder --opts=options
```

To generate a bunch of files in one run:

```
yarn start --opts=options
```

## In code

Let's consider generating of one picture:

```
import { generateQuote } from './cli';

generateQuote('image.jpg', './images', './destinationFolder', 'options');
```
