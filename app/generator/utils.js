import _ from 'lodash';
import { createCanvas } from 'canvas';

/**
 * Prepares canvas ctx
 *
 * @param {Object} options 
 */
export const getCanvasCtx = (options = {}) => {
  const {
    resizeWidth,
    resizeHeight,
    offsetX = 0,
    offsetY = 0,
  } = options;

  const canvas = createCanvas(resizeWidth - offsetX * 2, resizeHeight - offsetY * 2);
  const ctx = canvas.getContext('2d');

  return ctx;
};

/**
 * Measures text frame size
 *
 * @param {string} text
 * @param {Object} options
 *
 * @returns {Array}
 */
export const measureTextFrame = (text, options = {}) => {
  const {
    fontSize,
    fontFamily,
  } = options;

  const ctx = getCanvasCtx(options)

  ctx.font = `${fontSize}px ${fontFamily}"`;

  const {
    width,
    emHeightAscent,
    emHeightDescent,
  } = ctx.measureText(text);

  return [ width, emHeightAscent + emHeightDescent ];
};

/**
 * Add line breaks to text
 *
 * @param {string} text
 * @param {number} frameSize
 */
export const addLineBreak = (text, { frameWidth = 900, fontSize, fontFamily }) => {
  const ctx = getCanvasCtx({
    resizeWidth: 4000,
    resizeHeight: 4000,
    fontSize,
    fontFamily,
  })

  ctx.font = `${fontSize}px ${fontFamily}"`;

  return text.split('').reduce((acc, char) => {
    const { width } = ctx.measureText(acc);

    if (width >= frameWidth && acc[acc.length - 1] !== ' ') {
      const extra = `${acc.substring(acc.length, acc.lastIndexOf(' '))}${char}`;
      const memo = acc.substring(0, acc.lastIndexOf(' '))

      return extra[0] === ' '
        ? `${memo.trim()}\n${extra.substring(extra.length, 1)}`
        : `${memo.trim()}\n${extra}`
    }

    return acc + char;
  }, '')
};
