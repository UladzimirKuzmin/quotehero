import fs from 'fs';
import gm from 'gm';
import _ from 'lodash';

import { createCanvas, registerFont } from 'canvas';
import { defaults } from './config/defaults';

class Generator {
  /*
  * @param {Object} options
  */
  constructor(options) {
    this.options = _.merge(defaults, options);
  }

  /*
  * Generates image and saves it to the dist folder
  */
  generate() {
    this.registerFonts();

    const image = this.getImage();
    const text = this.getFittedText();

    if (this.options.resize) {
      this.resize(image);
    }

    if (this.options.crop) {
      this.crop(image);
    }

    if (!Object.is([], this.options.effects)) {
      this.applyEffect(image);
    }

    if (this.options.drawShape) {
      this.drawShape(image);
    }

    if (this.options.drawText) {
      this.drawText(image, text);
    }

    if (this.options.drawCaption) {
      this.drawCaption(image);
    }

    if (this.options.monochrome) {
      image.monochrome();
    }

    image
      .noProfile()
      .write(`${this.options.dist}/${this.options.result}`, this.options.cb);
  }

  /*
  * Register fonts for using in canvas
  */
  registerFonts() {
    registerFont(this.options.textOptions.font.path, {
      family: this.options.textOptions.font.family
    });

    registerFont(this.options.captionOptions.font.path, {
      family: this.options.captionOptions.font.family
    });
  }

  /*
  * @returns GM instance of original image
  */
  getImage() {
    return gm(`${this.options.src}/${this.options.original}`);
  }

  /*
  * Invokes resize method on the gm instance of image
  * @param {Object} image
  */
  resize(image) {
    image.resize(this.options.resizeOptions.width, this.options.resizeOptions.height, '^');
  }

  /*
  * Invokes crop method on the gm instance of image
  * @param {Object} image
  */
  crop(image) {
    image.crop(this.options.resizeOptions.width, this.options.resizeOptions.height);
  }

  /*
  * Applies a given filter method on the gm instance of image
  * @param {Object} image
  */
  applyEffect(image) {
    this.options.effects.forEach(effect => {
      const args = Object.values(effect[Object.keys(effect)[0]]);
      image[Object.keys(effect)[0]](...args);
    });
  }

  /*
  * Draws a given shape on the gm instance of image
  * @param {Object} image
  */
  drawShape(image) {
    image
      .stroke(this.options.drawOptions.stroke.color, this.options.drawOptions.stroke.size)
      .fill(this.options.drawOptions.fill)

    switch (this.options.drawOptions.shape) {
      case 'line':
        image.draw('line', ...this.options.drawOptions.coords); //[50, 50, 1030, 50]
        break;
      case 'rectangle':
        image.draw('rectangle', ...this.getRectangleCoords());
        break;
      case 'polyline':
        image.draw('polyline', ...this.options.drawOptions.coords); //[50, 50], [1030, 50], [1030, 1030], [50, 1030], [50, 50]
        break;
    }
  }

  /*
  * Draws a given text on the gm instance of image
  * @param {Object} image
  * @param {String} text
  */
  drawText(image, text) {
    image
      .gravity(this.options.textOptions.gravity)
      .stroke(
        this.options.textOptions.stroke.color,
        this.options.textOptions.stroke.size
      )
      .fill(this.options.textOptions.color)
      .font(this.options.textOptions.font.path, this.options.textOptions.size)
      .drawText(...this.getTextCoords(), text);
  }

  /*
  * Draws a given caption on the gm instance of image
  * @param {Object} image
  */
  drawCaption(image) {
    image
      .gravity(this.options.captionOptions.gravity)
      .stroke(
        this.options.captionOptions.stroke.color,
        this.options.captionOptions.stroke.size
      )
      .fill(this.options.captionOptions.color)
      .font(this.options.captionOptions.font.path, this.options.captionOptions.size)
      .drawText(...this.getCaptionCoords(), this.options.captionOptions.caption);
  }

  /*
  * Fits text into a given text frame by resizing font size and adding '\n'
  * @returns {String} text
  */
  getFittedText() {
    const canvas = createCanvas(4000, 4000);
    const ctx = canvas.getContext('2d');
    const [ frameWidth, frameHeight ] = this.getTextFrameSize();

    let output = '';

    while(true) {
      let memo = '';
      let chunks = [];
      ctx.font = `${this.options.textOptions.size}px ${this.options.textOptions.font.family}"`;

      _.each(this.options.textOptions.text, char => {
        memo += char;
        const { width } = ctx.measureText(memo);

        if (width >= frameWidth) {
          if (memo[memo.length - 1] !== ' ') {
            const extra = memo.substring(memo.length, memo.lastIndexOf(' '));
            memo = memo.substring(0, memo.lastIndexOf(' '))
            chunks.push(`${memo.trim()}\n`);
            memo = extra || '';
          }
        }
      });

      const result = `${chunks.join('')}${memo.trim()}`;
      const actualHeight = ctx.measureText(result).actualBoundingBoxDescent;

      if (actualHeight >= frameHeight) break;

      output = result;

      this.options.textOptions.size++;
    }

    return output;
  }

  /*
  * Calculates frame size
  * @returns {Object}
  */
  getFrameSize() {
    const horizontal = this.options.resizeOptions.width * this.options.drawOptions.frameRatio;
    const vertical = this.options.resizeOptions.height * this.options.drawOptions.frameRatio;

    return { horizontal, vertical };
  }

  /*
  * Calculates text size
  * @returns {Array}
  */
  getTextFrameSize() {
    const [ rectangleWidth, rectangleHeight ] = this.getRectangleSize();
    const [ captionWidth, captionHeight ] = this.getCaptionFrameSize();

    let textWidth = rectangleWidth - this.options.textOptions.offsets.x * 2;
    let textHeight = rectangleHeight - this.options.textOptions.offsets.y * 2;

    if (this.options.drawCaption) {
       textHeight -= (captionHeight + this.options.captionOptions.offsets.y / 2);
    }

    return [ textWidth, textHeight ];
  }

  /*
  * Calculates caption size
  * @returns {Array}
  */
  getCaptionFrameSize() {
    const canvas = createCanvas(1000, 1000);
    const ctx = canvas.getContext('2d');

    ctx.font = `${this.options.captionOptions.size}px ${this.options.captionOptions.font.family}"`;

    const {
      actualBoundingBoxRight,
      actualBoundingBoxAscent,
    } = ctx.measureText(this.options.captionOptions.caption);

    return [ actualBoundingBoxRight, actualBoundingBoxAscent ];
  }

  /*
  * Calculates rectangle size
  * @returns {Array}
  */
  getRectangleSize() {
    const [ x0, y0, x1, y1 ] = this.getRectangleCoords();
    return [ x1 - x0, y1 - y0 ];
  }

  /*
  * Calculates rectangle coords
  * @returns {Array}
  */
  getRectangleCoords() {
    const { horizontal, vertical } = this.getFrameSize();
    const x0 = horizontal;
    const y0 = vertical;
    const x1 = this.options.resizeOptions.width - horizontal;
    const y1 = this.options.resizeOptions.height - vertical;

    return [ x0, y0, x1, y1 ];
  }

  /*
  * Calculates text coords
  * @returns {Array}
  */
  getTextCoords() {
    const [ x0, y0 ] = this.getRectangleCoords();
    switch (this.options.textOptions.gravity) {
      case 'Center':
        return [0, 0];
      case 'West':
        return [x0 + this.options.textOptions.offsets.x, 0];
      default:
        return [ x0 + this.options.textOptions.offsets.x, y0 + this.options.textOptions.offsets.y ];
    }
  }

  /*
  * Calculates caption coords
  * @returns {Array}
  */
  getCaptionCoords() {
    const [ x1, y1 ] = this.getRectangleCoords();
    switch (this.options.captionOptions.gravity) {
      case 'South':
        return [0, y1 + this.options.captionOptions.offsets.y];
      default:
        return [ x1 + this.options.captionOptions.offsets.x, y1 + this.options.captionOptions.offsets.y ];
    }
  }
}

export default Generator;
