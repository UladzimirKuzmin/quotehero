import gm from 'gm';
import _ from 'lodash';
import { registerFont } from 'canvas';

import { defaults } from './config/defaults';
import { measureTextFrame, getCanvasCtx, addLineBreak } from './utils'

export default class Generator {

  /**
   * @constructor
   */
  constructor(options) {
    this.options = _.mergeWith({}, defaults, options);
  }

  /**
   * Generates image and saves it to the dist folder
   */
  generate() {
    const {
      textOptions: {
        size: textFontSize,
        font: {
          textFontFamily,
        } = {}
      } = {},
      captionOptions: {
        size: captionFontSize,
        font: {
          captionFontFamily,
        } = {}
      } = {},
    } = this.options;

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
      const text = this.options.textOptions.breakLine
        ? addLineBreak(this.options.textOptions.text, {
          fontSize: textFontSize,
          fontFamily: textFontFamily,
        })
        : this.getFittedText(this.options.textOptions.text);

      this.drawText(text);
    }

    if (this.options.drawCaption) {
      const caption = this.options.captionOptions.breakLine
        ? addLineBreak(this.options.captionOptions.caption, {
          fontSize: captionFontSize,
          fontFamily: captionFontFamily,
        })
        : this.options.captionOptions.caption;
      
      this.drawCaption(caption);
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

  /**
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

  /**
   * @returns GM instance of original image filename
   */
  getImage() {
    return gm(`${this.options.src}/${this.options.filename}`);
  }

  /**
   * Invokes resize method on the gm instance of image
   *
   * @param {Object} image
   */
  resize() {
    this.image.resize(this.options.resizeOptions.width, this.options.resizeOptions.height, '^');
  }

  /**
   * Invokes crop method on the gm instance of image
   *
   * @param {Object} image
   */
  crop() {
    this.image.crop(this.options.resizeOptions.width, this.options.resizeOptions.height);
  }

  /**
   * Applies a given filter method on the gm instance of image
   *
   * @param {Object} image
   */
  applyEffect() {
    this.options.effects.forEach(effect => {
      const args = Object.values(effect[Object.keys(effect)[0]]);
      this.image[Object.keys(effect)[0]](...args);
    });
  }

  /**
   * Draws a given shape on the gm instance of image
   *
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

  /**
   * Draws divider line
   */
  drawDivider() {
    this.image
      .fill(this.options.dividerOptions.fill)
      .draw(this.options.dividerOptions.type, ...this.getTextCaptionDividerCoords());
  }

  /**
   * Draws a given text on the gm instance of image
   *
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

  /**
   * Draws a given caption on the gm instance of image
   *
   * @param {string} caption
   */
  drawCaption(caption) {
    this.image
      .gravity(this.options.captionOptions.gravity)
      .stroke(
        this.options.captionOptions.stroke.color,
        this.options.captionOptions.stroke.size
      )
      .fill(this.options.captionOptions.color)
      .font(this.options.captionOptions.font.path, this.options.captionOptions.size)
      .drawText(...this.getCaptionCoords(), caption);
  }

  /**
   * Fits text into a given text frame by resizing font size and adding '\n'
   *
   * @param {string} text
   *
   * @returns {string}
   */
  getFittedText(text) {
    const {
      textOptions: {
        size: fontSize,
        font: {
          family: fontFamily,
        } = {},
      } = {},
    } = this.options;

    const ctx = getCanvasCtx({
      resizeWidth: 4000,
      resizeHeight: 4000,
      fontSize,
      fontFamily,
    })

    const [ frameWidth, frameHeight ] = this.getTextPossibleFrameSize();

    let output = '';

    while(true) {
      let memo = '';
      let result = '';
      let chunks = [];
      let actualHeight = 0;

      ctx.font = `${this.options.textOptions.size}px ${fontFamily}"`;

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

      result = `${chunks.join('')}${memo.trim()}`;

      actualHeight = ctx.measureText(result).actualBoundingBoxDescent;

      if (actualHeight >= frameHeight) break;

      output = result;

      this.options.textOptions.size++;
    }

    return output;
  }

  /**
   * Calculates frame size
   *
   * @returns {Object}
   */
  getFrameSize() {
    const {
      drawShape,
      drawOptions: {
        frameRatio,
      } = {},
      resizeOptions: {
        width,
        height,
      } = {},
    } = this.options;

    const offsetX = drawShape ? width * frameRatio : 0;
    const offsetY = drawShape ? height * frameRatio : 0;

    return { offsetX, offsetY };
  }

  /**
   * Calculates text possible frame size
   *
   * @returns {Array}
   */
  getTextPossibleFrameSize() {
    const {
      textOptions: {
        offsets: {
          x,
          y,
        },
      } = {},
      drawCaption,
      captionOptions: {
        offsets: {
          y: captionY,
        }
      } = {},
     } = this.options;

    const [ rectangleWidth, rectangleHeight ] = this.getRectangleSize();
    const [ captionWidth, captionHeight ] = this.getCaptionFrameSize();

    const textWidth = rectangleWidth - x * 2;
    const textHeight = drawCaption
      ? (rectangleHeight - y * 2) - (captionHeight + captionY / 2)
      : rectangleHeight - y * 2;

    return [ textWidth, textHeight ];
  }

  /**
   * Calculates text frame size
   *
   * @returns {Array}
   */
  getTextFrameSize() {
    const {
      resizeOptions: {
        width: resizeWidth,
        height: resizeHeight,
      },
      textOptions: {
        size: fontSize,
        font: {
          family: fontFamily,
        } = {},
        offsets: {
          x: offsetX,
          y: offsetY,
        },
        breakLine,
        text,
      } = {},
    } = this.options;

    const updatedText = breakLine
      ? addLineBreak(text, { fontSize, fontFamily })
      : text;

    return measureTextFrame(updatedText, {
      resizeWidth,
      resizeHeight,
      fontSize,
      fontFamily,
      offsetX,
      offsetY,
    });
  }

  /**
   * Calculates caption frame size
   *
   * @returns {Array}
   */
  getCaptionFrameSize() {
    const {
      resizeOptions: {
        width: resizeWidth,
        height: resizeHeight,
      },
      captionOptions: {
        size: fontSize,
        font: {
          family: fontFamily,
        } = {},
        offsets: {
          x: offsetX,
          y: offsetY,
        },
        breakLine,
        caption,
      } = {},
    } = this.options;

    const updatedCaption = breakLine
      ? addLineBreak(caption, { fontSize, fontFamily })
      : caption;

    return measureTextFrame(updatedCaption, {
      resizeWidth,
      resizeHeight,
      fontSize,
      fontFamily,
      offsetX,
      offsetY,
    });
  }

  /**
   * Calculates rectangle size
   *
   * @returns {Array}
   */
  getRectangleSize() {
    const [ x0, y0, x1, y1 ] = this.getFrameCoords();
    return [ x1 - x0, y1 - y0 ];
  }

  /**
   * Calculates rectangle coords
   *
   * @returns {Array}
   */
  getFrameCoords() {
    const {
      resizeOptions: {
        width,
        height,
      } = {},
    } = this.options;

    const {
      offsetX,
      offsetY,
    } = this.getFrameSize();

    const x0 = offsetX;
    const y0 = offsetY;
    const x1 = width - x0;
    const y1 = height - y0;

    return [ x0, y0, x1, y1 ];
  }

  /**
   * Calculates text coords
   *
   * @returns {Array}
   */
  getTextCoords() {
    const {
      resizeOptions: {
        height,
      } = {},
      textOptions: {
        gravity,
        deltaY,
        offsets: {
          x,
          y,
        } = {},
      } = {},
      captionOptions: {
        offsets: {
          y: captionY,
        } = {},
      } = {},
    } = this.options;

    const [ x0, y0 ] = this.getFrameCoords();
    const [ textWidth, textHeight ] = this.getTextFrameSize();
    const [ captionWidth, captionHeight ] = this.getCaptionFrameSize();

    const calculatedY = (height - (textHeight + captionHeight + (captionY - y))) / 2 + deltaY;

    switch (gravity) {
      case 'Center':
        return [0, 0];
      case 'North':
        return [0, y0 + y];
      case 'West':
        return [x0 + x, 0];
      default:
        return [ x0 + x, y0 + calculatedY ];
    }
  }

  /**
   * Calculates caption coords
   *
   * @returns {Array}
   */
  getCaptionCoords() {
    const {
      resizeOptions: {
        height,
      } = {},
      captionOptions: {
        gravity,
        deltaY,
        offsets: {
          x,
          y,
        } = {},
      } = {},
      textOptions: {
        offsets: {
          y: textY,
        } = {},
      } = {},
    } = this.options;

    const [ x1, y1 ] = this.getFrameCoords();
    const [ textWidth, textHeight ] = this.getTextFrameSize();
    const [ captionWidth, captionHeight ] = this.getCaptionFrameSize();

    const textBottomOffset = y - textY;
    const calculatedTextY = (height - (textHeight + captionHeight + (y - textY))) / 2 + deltaY;

    switch (gravity) {
      case 'South':
        return [0, y1 + y];
      default:
        return [ x1 + x, y1 + textHeight + calculatedTextY + textBottomOffset ];
    }
  }

  /**
   * Calculates text and caption divider coords
   *
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
