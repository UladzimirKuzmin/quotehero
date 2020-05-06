# Quotehero

Picture quotes generator

## Install
Clone the repo and install the dependencies: 

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
