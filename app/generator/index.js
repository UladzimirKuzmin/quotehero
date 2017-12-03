import gm from 'gm';
import _ from 'lodash';

import { createCanvas, registerFont } from 'canvas';
import { defaults } from './config/defaults';

class Generator {
  /*
  * @param {Object} options
  */
  constructor(options) {
    this.options = _.mergeWith({}, defaults, options);
  }

  /*
  * Generates image and saves it to the dist folder
  */
  generate() {
    this.image = this.getImage();
    this.registerFonts();

    if (this.options.resize) {
      this.resize();
    }

    if (this.options.crop) {
      this.crop();
    }

    if (!Object.is([], this.options.effects)) {
      this.applyEffect();
    }

    if (this.options.drawShape) {
      this.drawShape();
    }

    if (this.options.drawText) {
      this.drawText(this.getFittedText(this.options.textOptions.text));
    }

    if (this.options.drawCaption) {
      this.drawCaption();
    }

    if (this.options.drawDivider) {
      this.drawDivider();
    }

    if (this.options.monochrome) {
      this.image.monochrome();
    }

    this.image
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
  resize() {
    this.image.resize(this.options.resizeOptions.width, this.options.resizeOptions.height, '^');
  }

  /*
  * Invokes crop method on the gm instance of image
  * @param {Object} image
  */
  crop() {
    this.image.crop(this.options.resizeOptions.width, this.options.resizeOptions.height);
  }

  /*
  * Applies a given filter method on the gm instance of image
  * @param {Object} image
  */
  applyEffect() {
    this.options.effects.forEach(effect => {
      const args = Object.values(effect[Object.keys(effect)[0]]);
      this.image[Object.keys(effect)[0]](...args);
    });
  }

  /*
  * Draws a given shape on the gm instance of image
  * @param {Object} image
  */
  drawShape(coords) {
    this.image
      .stroke(this.options.drawOptions.stroke.color, this.options.drawOptions.stroke.size)
      .fill(this.options.drawOptions.fill)

    switch (this.options.drawOptions.shape) {
      case 'line':
        this.image.draw('line', ...this.options.drawOptions.coords); //[50, 50, 1030, 50]
        break;
      case 'rectangle':
        this.image.draw('rectangle', ...this.getFrameCoords());
        break;
      case 'polyline':
        this.image.draw('polyline', ...this.options.drawOptions.coords); //[50, 50], [1030, 50], [1030, 1030], [50, 1030], [50, 50]
        break;
    }
  }

  drawDivider() {
    this.image
        .fill(this.options.dividerOptions.fill)
        .draw('line', ...this.getTextCaptionDividerCoords());
  }

  /*
  * Draws a given text on the gm instance of image
  * @param {Object} image
  * @param {String} text
  */
  drawText(text) {
    this.image
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
  drawCaption() {
    this.image
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
  getFittedText(text) {
    const canvas = createCanvas(4000, 4000);
    const ctx = canvas.getContext('2d');
    const [ frameWidth, frameHeight ] = this.getTextFrameSize();

    let output = '';

    while(true) {
      let memo = '';
      let chunks = [];
      ctx.font = `${this.options.textOptions.size}px ${this.options.textOptions.font.family}"`;

      _.each(text, char => {
        memo += char;
        const { width } = ctx.measureText(memo);

        if (width >= frameWidth && memo[memo.length - 1] !== ' ') {
          const extra = memo.substring(memo.length, memo.lastIndexOf(' '));
          memo = memo.substring(0, memo.lastIndexOf(' '))
          chunks.push(`${memo.trim()}\n`);
          memo = extra || '';
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
      width,
      emHeightAscent,
    } = ctx.measureText(this.options.captionOptions.caption);

    return [ width, emHeightAscent ];
  }

  /*
  * Calculates rectangle size
  * @returns {Array}
  */
  getRectangleSize() {
    const [ x0, y0, x1, y1 ] = this.getFrameCoords();
    return [ x1 - x0, y1 - y0 ];
  }

  /*
  * Calculates rectangle coords
  * @returns {Array}
  */
  getFrameCoords() {
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
    const [ x0, y0 ] = this.getFrameCoords();
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
    const [ x1, y1 ] = this.getFrameCoords();
    switch (this.options.captionOptions.gravity) {
      case 'South':
        return [0, y1 + this.options.captionOptions.offsets.y];
      default:
        return [ x1 + this.options.captionOptions.offsets.x, y1 + this.options.captionOptions.offsets.y ];
    }
  }

  /*
  * Calculates text and caption divider coords
  * @returns {Array}
  */
  getTextCaptionDividerCoords() {
    const [ x0, y0, x1, y1 ] = this.getFrameCoords();
    const [ captionWidth, captionHeight ] = this.getCaptionFrameSize();
    const [ coordX, coordY ] = this.getCaptionCoords();
    const cy = y1 - coordY; // default vertical position
    const defaultCoords = [ coordX, cy, x1 - this.options.captionOptions.offsets.x, cy ];

    if (this.options.dividerOptions.stretch) {
      return defaultCoords;
    }

    switch (this.options.captionOptions.gravity) {
      case 'SouthEast':
        const xse0 = x1 - this.options.captionOptions.offsets.x - captionWidth;
        const xse1 = x1 - this.options.captionOptions.offsets.x;
        return [ xse0, cy, xse1, cy ];
      case 'SouthWest':
        const xsw0 = coordX;
        const xsw1 = coordX + captionWidth;
        return [ xsw0, cy, xsw1, cy ];
      case 'South':
        const xc0 = (x1 - x0 - captionWidth / 2) / 2;
        const xc1 = (x1 - captionWidth / 2) / 2 + captionWidth;
        return [ xc0, cy, xc1, cy ];
      default:
        return defaultCoords;
    }
  }
}

export default Generator;
