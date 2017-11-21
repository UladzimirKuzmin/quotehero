import fs from 'fs';
import gm from 'gm';
import _ from 'lodash';

import { createCanvas, registerFont } from 'canvas';
import { defaults } from './config/defaults';

class Generator {
  constructor(options) {
    this.options = _.merge(defaults, options);

    registerFont(this.options.textOptions.font.path, {
      family: this.options.textOptions.font.family
    });

    registerFont(this.options.captionOptions.font.path, {
      family: this.options.captionOptions.font.family
    });
  }

  generate() {
    const text = this.getText();
    const image = this.getImage();

    if (this.options.resize) {
      image.resize(this.options.resizeOptions.width, this.options.resizeOptions.height, '^');
    }

    if (this.options.crop) {
      image
        .crop(this.options.resizeOptions.width, this.options.resizeOptions.height);
    }

    if (!Object.is([], this.options.effects)) {
      this.options.effects.forEach(effect => {
        const args = Object.values(effect[Object.keys(effect)[0]]);
        image[Object.keys(effect)[0]](...args);
      });
    }

    if (this.options.drawShape) {
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

    if (this.options.drawText) {
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

    if (this.options.drawCaption) {
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

    if (this.options.monochrome) {
      image.monochrome();
    }

    image
      .noProfile()
      .write(`${this.options.dist}/${this.options.result}`, this.options.cb);
  }

  getText() {
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
            const redundant = memo.substring(memo.length, memo.lastIndexOf(' '));
            memo = memo.substring(0, memo.lastIndexOf(' '))
            chunks.push(`${memo.trim()}\n`);
            memo = redundant || '';
          }
        }
      });

      let result = `${chunks.join('')}${memo.trim()}`;
      let actualHeight = ctx.measureText(result).actualBoundingBoxDescent;

      if (actualHeight >= frameHeight) {
        output = result;
        break;
      }

      this.options.textOptions.size++;
    }

    return output;
  }

  getImage() {
    return gm(`${this.options.src}/${this.options.original}`);
  }

  getFrameSize() {
    const horizontal = this.options.resizeOptions.width * this.options.drawOptions.frameRatio;
    const vertical = this.options.resizeOptions.height * this.options.drawOptions.frameRatio;

    return { horizontal, vertical };
  }

  getTextFrameSize() {
    const [ width , height ] = this.getRectangleSize();
    return [
      width - this.options.textOptions.offsets.x * 2,
      height - this.options.textOptions.offsets.y * 2
    ];
  }

  getRectangleSize() {
    const [ x0, y0, x1, y1 ] = this.getRectangleCoords();
    return [ x1 - x0, y1 - y0 ];
  }

  getRectangleCoords() {
    const { horizontal, vertical } = this.getFrameSize();

    const x0 = horizontal;
    const y0 = vertical;
    const x1 = this.options.resizeOptions.width - horizontal;
    const y1 = this.options.resizeOptions.height - vertical;

    return [ x0, y0, x1, y1 ];
  }

  getTextCoords() {
    const [ x0, y0 ] = this.getRectangleCoords();
    return [ x0 + this.options.textOptions.offsets.x, y0 + this.options.textOptions.offsets.y ];
  }

  getCaptionCoords() {
    const [ x1, y1 ] = this.getRectangleCoords();
    return [ x1 + this.options.captionOptions.offsets.x, y1 + this.options.captionOptions.offsets.y ];
  }
}

export default Generator;
